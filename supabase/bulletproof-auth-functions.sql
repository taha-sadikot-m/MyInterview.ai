-- COMPLETE FIX FOR ALL AMBIGUOUS COLUMN REFERENCES
-- This script recreates ALL functions with completely unambiguous column and parameter names

-- ===============================
-- 1. FUNCTION: ensure_user_setup (BULLETPROOF VERSION)
-- ===============================

-- Drop existing function first to avoid parameter name conflicts
DROP FUNCTION IF EXISTS public.ensure_user_setup(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.ensure_user_setup(UUID, TEXT);

CREATE OR REPLACE FUNCTION public.ensure_user_setup(
    p_user_uuid UUID,
    p_user_email TEXT,
    p_user_name TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    verification_code TEXT,
    message TEXT
) AS $$
DECLARE
    v_new_verification_code TEXT;
BEGIN
    -- Generate a new verification code
    v_new_verification_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Insert or update user profile
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        email_verified,
        email_verification_code,
        email_verification_expires,
        verification_attempts,
        created_at,
        updated_at
    )
    VALUES (
        p_user_uuid::TEXT,
        p_user_email,
        p_user_name,
        false,
        v_new_verification_code,
        NOW() + INTERVAL '15 minutes',
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        email_verification_code = EXCLUDED.email_verification_code,
        email_verification_expires = EXCLUDED.email_verification_expires,
        verification_attempts = 0, -- Reset attempts on new setup
        updated_at = EXCLUDED.updated_at;
    
    RETURN QUERY SELECT true, p_user_uuid::TEXT, v_new_verification_code, 'User setup completed successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 2. FUNCTION: generate_verification_code (BULLETPROOF VERSION)
-- ===============================
CREATE OR REPLACE FUNCTION public.generate_verification_code(p_user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    v_new_code TEXT;
BEGIN
    -- Generate a new random 6-digit code
    v_new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with new code
    UPDATE public.profiles
    SET 
        email_verification_code = v_new_code,
        email_verification_expires = NOW() + INTERVAL '15 minutes',
        verification_attempts = COALESCE(verification_attempts, 0) + 1,
        updated_at = NOW()
    WHERE profiles.email = p_user_email;
    
    -- Check if user was found and updated
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', p_user_email;
    END IF;
    
    RETURN v_new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 3. FUNCTION: verify_email_code (BULLETPROOF VERSION)
-- ===============================
CREATE OR REPLACE FUNCTION public.verify_email_code(p_user_email TEXT, p_verification_code TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    v_profile_record RECORD;
BEGIN
    -- Find profile with matching code and email
    SELECT * INTO v_profile_record
    FROM public.profiles
    WHERE profiles.email = p_user_email
    AND profiles.email_verification_code = p_verification_code
    AND profiles.email_verification_expires > NOW()
    AND COALESCE(profiles.email_verified, false) = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired verification code'::TEXT;
        RETURN;
    END IF;
    
    -- Mark email as verified
    UPDATE public.profiles
    SET 
        email_verified = true,
        email_verification_code = NULL,
        email_verification_expires = NULL,
        updated_at = NOW()
    WHERE profiles.user_id = v_profile_record.user_id;
    
    RETURN QUERY SELECT true, v_profile_record.user_id, 'Email verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 4. FUNCTION: resend_verification_code (BULLETPROOF VERSION)
-- ===============================
CREATE OR REPLACE FUNCTION public.resend_verification_code(p_user_email TEXT)
RETURNS TABLE (
    success BOOLEAN,
    code TEXT,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    v_profile_record RECORD;
    v_new_code TEXT;
BEGIN
    -- Find profile with email
    SELECT * INTO v_profile_record
    FROM public.profiles
    WHERE profiles.email = p_user_email
    AND COALESCE(profiles.email_verified, false) = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or already verified'::TEXT;
        RETURN;
    END IF;
    
    -- Check if too many attempts
    IF COALESCE(v_profile_record.verification_attempts, 0) >= 5 THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Too many verification attempts. Please contact support.'::TEXT;
        RETURN;
    END IF;
    
    -- Generate new code
    v_new_code := public.generate_verification_code(p_user_email);
    
    RETURN QUERY SELECT true, v_new_code, v_profile_record.user_id, 'New verification code generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 5. FUNCTION: generate_password_reset_code (BULLETPROOF VERSION)
-- ===============================
CREATE OR REPLACE FUNCTION public.generate_password_reset_code(p_user_email TEXT)
RETURNS TABLE (
    success BOOLEAN,
    code TEXT,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    v_profile_record RECORD;
    v_reset_code TEXT;
BEGIN
    -- Find profile with email
    SELECT * INTO v_profile_record
    FROM public.profiles
    WHERE profiles.email = p_user_email
    AND COALESCE(profiles.email_verified, false) = true; -- Only allow reset for verified emails
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or not verified'::TEXT;
        RETURN;
    END IF;
    
    -- Generate a new random 6-digit reset code
    v_reset_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with reset code
    UPDATE public.profiles
    SET 
        password_reset_code = v_reset_code,
        password_reset_expires = NOW() + INTERVAL '15 minutes',
        updated_at = NOW()
    WHERE profiles.user_id = v_profile_record.user_id;
    
    RETURN QUERY SELECT true, v_reset_code, v_profile_record.user_id, 'Password reset code generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 6. FUNCTION: verify_password_reset_code (BULLETPROOF VERSION)
-- ===============================
CREATE OR REPLACE FUNCTION public.verify_password_reset_code(p_user_email TEXT, p_reset_code TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    v_profile_record RECORD;
BEGIN
    -- Find profile with matching reset code and email
    SELECT * INTO v_profile_record
    FROM public.profiles
    WHERE profiles.email = p_user_email
    AND profiles.password_reset_code = p_reset_code
    AND profiles.password_reset_expires > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired reset code'::TEXT;
        RETURN;
    END IF;
    
    -- Clear the reset code (one-time use)
    UPDATE public.profiles
    SET 
        password_reset_code = NULL,
        password_reset_expires = NULL,
        updated_at = NOW()
    WHERE profiles.user_id = v_profile_record.user_id;
    
    RETURN QUERY SELECT true, v_profile_record.user_id, 'Reset code verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 7. GRANT PERMISSIONS (BULLETPROOF VERSION)
-- ===============================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.generate_verification_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_email_code(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resend_verification_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_password_reset_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_code(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_setup(UUID, TEXT, TEXT) TO authenticated;

-- Grant permissions for anonymous users (for registration)
GRANT EXECUTE ON FUNCTION public.generate_verification_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_email_code(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.resend_verification_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.ensure_user_setup(UUID, TEXT, TEXT) TO anon;

-- ===============================
-- 8. DOCUMENTATION
-- ===============================

COMMENT ON FUNCTION public.generate_verification_code(TEXT) IS 'Generates a new 6-digit verification code for email verification';
COMMENT ON FUNCTION public.verify_email_code(TEXT, TEXT) IS 'Verifies email using 6-digit code';
COMMENT ON FUNCTION public.resend_verification_code(TEXT) IS 'Resends verification code to email';
COMMENT ON FUNCTION public.ensure_user_setup(UUID, TEXT, TEXT) IS 'Ensures user profile is set up correctly during registration';