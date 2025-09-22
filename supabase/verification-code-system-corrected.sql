-- Verification Code System Update - CORRECTED for user_profiles table
-- This script updates the system to use 6-digit verification codes instead of tokens

-- ===============================
-- 1. UPDATE USER_PROFILES TABLE FOR CODES
-- ===============================

-- Add verification code fields to user_profiles table
DO $$
BEGIN
    -- First, let's check if we need to add email and email_verified fields to user_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='email') THEN
        ALTER TABLE public.user_profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='email_verified') THEN
        ALTER TABLE public.user_profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
    END IF;
    
    -- Add email_verification_code column (6-digit code)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='email_verification_code') THEN
        ALTER TABLE public.user_profiles ADD COLUMN email_verification_code TEXT;
    END IF;
    
    -- Add email_verification_expires column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='email_verification_expires') THEN
        ALTER TABLE public.user_profiles ADD COLUMN email_verification_expires TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add verification_attempts column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='verification_attempts') THEN
        ALTER TABLE public.user_profiles ADD COLUMN verification_attempts INTEGER DEFAULT 0;
    END IF;
    
    -- Add password_reset_code column (6-digit code)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='password_reset_code') THEN
        ALTER TABLE public.user_profiles ADD COLUMN password_reset_code TEXT;
    END IF;
    
    -- Add password_reset_expires column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='password_reset_expires') THEN
        ALTER TABLE public.user_profiles ADD COLUMN password_reset_expires TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add full_name column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='full_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- ===============================
-- 2. UPDATE PROFILE CREATION TRIGGER
-- ===============================

-- Create or update the handle_new_user function to work with user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    verification_code TEXT;
BEGIN
    -- Generate a random 6-digit verification code
    verification_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Auto-confirm the user in auth.users if not already confirmed
    IF NEW.email_confirmed_at IS NULL THEN
        UPDATE auth.users 
        SET email_confirmed_at = NOW()
        WHERE id = NEW.id;
    END IF;
    
    -- Insert or update user_profiles
    INSERT INTO public.user_profiles (
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
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        false, -- Our custom verification, not Supabase's
        verification_code,
        NOW() + INTERVAL '15 minutes', -- Codes expire in 15 minutes
        0,
        NEW.created_at,
        NEW.updated_at
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        email_verification_code = EXCLUDED.email_verification_code,
        email_verification_expires = EXCLUDED.email_verification_expires,
        updated_at = EXCLUDED.updated_at;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================
-- 3. VERIFICATION CODE FUNCTIONS
-- ===============================

-- Function to generate new verification code by email
CREATE OR REPLACE FUNCTION public.generate_verification_code(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    user_found BOOLEAN := false;
BEGIN
    -- Generate a new random 6-digit code
    new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with new code
    UPDATE public.user_profiles
    SET 
        email_verification_code = new_code,
        email_verification_expires = NOW() + INTERVAL '15 minutes',
        verification_attempts = COALESCE(verification_attempts, 0) + 1,
        updated_at = NOW()
    WHERE email = user_email;
    
    GET DIAGNOSTICS user_found = FOUND;
    
    IF NOT user_found THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify email with code
CREATE OR REPLACE FUNCTION public.verify_email_code(user_email TEXT, verification_code TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profile with matching code and email
    SELECT * INTO profile_record
    FROM public.user_profiles
    WHERE email = user_email
    AND email_verification_code = verification_code
    AND email_verification_expires > NOW()
    AND COALESCE(email_verified, false) = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired verification code'::TEXT;
        RETURN;
    END IF;
    
    -- Mark email as verified
    UPDATE public.user_profiles
    SET 
        email_verified = true,
        email_verification_code = NULL,
        email_verification_expires = NULL,
        updated_at = NOW()
    WHERE user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, profile_record.user_id, 'Email verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resend verification code
CREATE OR REPLACE FUNCTION public.resend_verification_code(user_email TEXT)
RETURNS TABLE (
    success BOOLEAN,
    code TEXT,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
    new_code TEXT;
BEGIN
    -- Find profile with email
    SELECT * INTO profile_record
    FROM public.user_profiles
    WHERE email = user_email
    AND COALESCE(email_verified, false) = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or already verified'::TEXT;
        RETURN;
    END IF;
    
    -- Check if too many attempts
    IF COALESCE(profile_record.verification_attempts, 0) >= 5 THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Too many verification attempts. Please contact support.'::TEXT;
        RETURN;
    END IF;
    
    -- Generate new code
    new_code := public.generate_verification_code(user_email);
    
    RETURN QUERY SELECT true, new_code, profile_record.user_id, 'New verification code generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 4. PASSWORD RESET FUNCTIONS
-- ===============================

-- Function to generate password reset code
CREATE OR REPLACE FUNCTION public.generate_password_reset_code(user_email TEXT)
RETURNS TABLE (
    success BOOLEAN,
    code TEXT,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
    reset_code TEXT;
BEGIN
    -- Find profile with email
    SELECT * INTO profile_record
    FROM public.user_profiles
    WHERE email = user_email
    AND COALESCE(email_verified, false) = true; -- Only allow reset for verified emails
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or not verified'::TEXT;
        RETURN;
    END IF;
    
    -- Generate a new random 6-digit reset code
    reset_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with reset code
    UPDATE public.user_profiles
    SET 
        password_reset_code = reset_code,
        password_reset_expires = NOW() + INTERVAL '15 minutes', -- Reset codes expire in 15 minutes
        updated_at = NOW()
    WHERE user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, reset_code, profile_record.user_id, 'Password reset code generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify password reset code
CREATE OR REPLACE FUNCTION public.verify_password_reset_code(user_email TEXT, reset_code TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profile with matching reset code and email
    SELECT * INTO profile_record
    FROM public.user_profiles
    WHERE email = user_email
    AND password_reset_code = reset_code
    AND password_reset_expires > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired reset code'::TEXT;
        RETURN;
    END IF;
    
    -- Clear the reset code (one-time use)
    UPDATE public.user_profiles
    SET 
        password_reset_code = NULL,
        password_reset_expires = NULL,
        updated_at = NOW()
    WHERE user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, profile_record.user_id, 'Reset code verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 5. ENSURE USER SETUP FUNCTION
-- ===============================

-- Function to ensure user setup (for registration flow)
CREATE OR REPLACE FUNCTION public.ensure_user_setup(
    user_uuid UUID,
    user_email TEXT,
    user_name TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    verification_code TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
    new_verification_code TEXT;
BEGIN
    -- Generate a new verification code
    new_verification_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Insert or update user profile
    INSERT INTO public.user_profiles (
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
        user_uuid::TEXT,
        user_email,
        user_name,
        false,
        new_verification_code,
        NOW() + INTERVAL '15 minutes',
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
        email_verification_code = EXCLUDED.email_verification_code,
        email_verification_expires = EXCLUDED.email_verification_expires,
        verification_attempts = 0, -- Reset attempts on new setup
        updated_at = EXCLUDED.updated_at;
    
    RETURN QUERY SELECT true, user_uuid::TEXT, new_verification_code, 'User setup completed successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 6. GRANT PERMISSIONS
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

COMMENT ON FUNCTION public.generate_verification_code(TEXT) IS 'Generates a new 6-digit verification code for email verification';
COMMENT ON FUNCTION public.verify_email_code(TEXT, TEXT) IS 'Verifies email using 6-digit code';
COMMENT ON FUNCTION public.resend_verification_code(TEXT) IS 'Resends verification code to email';
COMMENT ON FUNCTION public.ensure_user_setup(UUID, TEXT, TEXT) IS 'Ensures user profile is set up correctly during registration';