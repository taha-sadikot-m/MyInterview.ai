-- COMPLETELY CUSTOM AUTH SYSTEM - NO SUPABASE AUTH DEPENDENCY
-- This system manages users entirely in our profiles table without using auth.users

-- ===============================
-- 1. CUSTOM USER REGISTRATION FUNCTION
-- ===============================

-- Drop existing function first
DROP FUNCTION IF EXISTS public.custom_user_register(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.custom_user_register(
    p_email TEXT,
    p_password_hash TEXT,
    p_full_name TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    verification_code TEXT,
    message TEXT
) AS $$
DECLARE
    v_user_uuid TEXT;
    v_verification_code TEXT;
    v_existing_user RECORD;
BEGIN
    -- Check if user already exists
    SELECT * INTO v_existing_user
    FROM public.profiles
    WHERE profiles.email = p_email;
    
    IF FOUND THEN
        IF v_existing_user.email_verified = true THEN
            RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email already registered and verified'::TEXT;
        ELSE
            RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email already registered but not verified. Please check your email.'::TEXT;
        END IF;
        RETURN;
    END IF;
    
    -- Generate new user ID and verification code
    v_user_uuid := gen_random_uuid()::TEXT;
    v_verification_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Insert new user profile
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        password_hash,
        email_verified,
        email_verification_code,
        email_verification_expires,
        verification_attempts,
        subscription_tier,
        profile_completed,
        created_at,
        updated_at
    )
    VALUES (
        v_user_uuid,
        p_email,
        p_full_name,
        p_password_hash,
        false,
        v_verification_code,
        NOW() + INTERVAL '15 minutes',
        0,
        'free',
        false,
        NOW(),
        NOW()
    );
    
    RETURN QUERY SELECT true, v_user_uuid, v_verification_code, 'User registered successfully. Please verify your email.'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 2. CUSTOM USER LOGIN FUNCTION
-- ===============================

DROP FUNCTION IF EXISTS public.custom_user_login(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.custom_user_login(
    p_email TEXT,
    p_password_hash TEXT
)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    email_verified BOOLEAN,
    message TEXT,
    user_data JSONB
) AS $$
DECLARE
    v_user_record RECORD;
BEGIN
    -- Find user with matching email and password
    SELECT * INTO v_user_record
    FROM public.profiles
    WHERE profiles.email = p_email
    AND profiles.password_hash = p_password_hash;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, false, 'Invalid email or password'::TEXT, NULL::JSONB;
        RETURN;
    END IF;
    
    -- Update last login
    UPDATE public.profiles
    SET last_login = NOW()
    WHERE profiles.user_id = v_user_record.user_id;
    
    -- Return user data
    RETURN QUERY SELECT 
        true, 
        v_user_record.user_id, 
        COALESCE(v_user_record.email_verified, false),
        'Login successful'::TEXT,
        jsonb_build_object(
            'user_id', v_user_record.user_id,
            'email', v_user_record.email,
            'full_name', v_user_record.full_name,
            'email_verified', COALESCE(v_user_record.email_verified, false),
            'subscription_tier', v_user_record.subscription_tier,
            'profile_completed', COALESCE(v_user_record.profile_completed, false)
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 3. ADD PASSWORD HASH COLUMN IF MISSING
-- ===============================

DO $$
BEGIN
    -- Add password_hash column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='password_hash') THEN
        ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;
    END IF;
END $$;

-- ===============================
-- 4. BULLETPROOF VERIFICATION FUNCTIONS (UPDATED)
-- ===============================

-- Drop existing functions first
DROP FUNCTION IF EXISTS public.generate_verification_code(TEXT);
DROP FUNCTION IF EXISTS public.verify_email_code(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.resend_verification_code(TEXT);

-- Generate verification code (for custom auth)
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

-- Verify email code (for custom auth)
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

-- Resend verification code (for custom auth)
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
-- 5. GRANT PERMISSIONS
-- ===============================

-- Grant execute permissions to anonymous users (for registration/login)
GRANT EXECUTE ON FUNCTION public.custom_user_register(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.custom_user_login(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.generate_verification_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_email_code(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.resend_verification_code(TEXT) TO anon;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.custom_user_register(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.custom_user_login(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_verification_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_email_code(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resend_verification_code(TEXT) TO authenticated;

-- ===============================
-- 6. DOCUMENTATION
-- ===============================

COMMENT ON FUNCTION public.custom_user_register(TEXT, TEXT, TEXT) IS 'Register new user with custom authentication (no Supabase auth dependency)';
COMMENT ON FUNCTION public.custom_user_login(TEXT, TEXT) IS 'Login user with custom authentication';
COMMENT ON FUNCTION public.generate_verification_code(TEXT) IS 'Generate 6-digit verification code for email verification';
COMMENT ON FUNCTION public.verify_email_code(TEXT, TEXT) IS 'Verify email using 6-digit code';
COMMENT ON FUNCTION public.resend_verification_code(TEXT) IS 'Resend verification code to email';