-- Verification Code System Update
-- This script updates the system to use 6-digit verification codes instead of tokens

-- ===============================
-- 1. UPDATE PROFILES TABLE FOR CODES
-- ===============================

-- Add verification code fields
DO $$
BEGIN
    -- Add email_verification_code column (6-digit code)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='email_verification_code') THEN
        ALTER TABLE public.profiles ADD COLUMN email_verification_code TEXT;
    END IF;
    
    -- Add password_reset_code column (6-digit code)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='password_reset_code') THEN
        ALTER TABLE public.profiles ADD COLUMN password_reset_code TEXT;
    END IF;
    
    -- Add password_reset_expires column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='password_reset_expires') THEN
        ALTER TABLE public.profiles ADD COLUMN password_reset_expires TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- ===============================
-- 2. UPDATE PROFILE CREATION TRIGGER
-- ===============================

-- Update the handle_new_user function to generate verification codes
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
    
    -- Create profile with verification code
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        avatar_url,
        email_verified,
        email_verification_token,
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
        NEW.raw_user_meta_data->>'avatar_url',
        false, -- Our custom verification, not Supabase's
        encode(gen_random_bytes(32), 'hex'), -- Keep token for compatibility
        verification_code,
        NOW() + INTERVAL '15 minutes', -- Codes expire in 15 minutes
        0,
        NEW.created_at,
        NEW.updated_at
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 3. VERIFICATION CODE FUNCTIONS
-- ===============================

-- Function to generate new verification code
CREATE OR REPLACE FUNCTION public.generate_verification_code(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
BEGIN
    -- Generate a new random 6-digit code
    new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with new code
    UPDATE public.profiles
    SET 
        email_verification_code = new_code,
        email_verification_expires = NOW() + INTERVAL '15 minutes',
        verification_attempts = verification_attempts + 1,
        updated_at = NOW()
    WHERE user_id = user_uuid::TEXT;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify email with code
CREATE OR REPLACE FUNCTION public.verify_email_code(code TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profile with matching code
    SELECT * INTO profile_record
    FROM public.profiles
    WHERE email_verification_code = code
    AND email_verification_expires > NOW()
    AND email_verified = false;
    
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
    FROM public.profiles
    WHERE email = user_email
    AND email_verified = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or already verified'::TEXT;
        RETURN;
    END IF;
    
    -- Check if too many attempts
    IF profile_record.verification_attempts >= 5 THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Too many verification attempts. Please contact support.'::TEXT;
        RETURN;
    END IF;
    
    -- Generate new code
    new_code := public.generate_verification_code(profile_record.user_id::UUID);
    
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
    FROM public.profiles
    WHERE email = user_email
    AND email_verified = true; -- Only allow reset for verified emails
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or not verified'::TEXT;
        RETURN;
    END IF;
    
    -- Generate a new random 6-digit code
    reset_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with reset code
    UPDATE public.profiles
    SET 
        password_reset_code = reset_code,
        password_reset_expires = NOW() + INTERVAL '15 minutes',
        updated_at = NOW()
    WHERE user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, reset_code, profile_record.user_id, 'Password reset code generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify password reset code
CREATE OR REPLACE FUNCTION public.verify_password_reset_code(code TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profile with matching reset code
    SELECT * INTO profile_record
    FROM public.profiles
    WHERE password_reset_code = code
    AND password_reset_expires > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired password reset code'::TEXT;
        RETURN;
    END IF;
    
    -- Clear the reset code (it's been used)
    UPDATE public.profiles
    SET 
        password_reset_code = NULL,
        password_reset_expires = NULL,
        updated_at = NOW()
    WHERE user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, profile_record.user_id, 'Password reset code verified'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 5. UPDATE HELPER FUNCTION
-- ===============================

-- Update ensure_user_setup to work with codes
CREATE OR REPLACE FUNCTION public.ensure_user_setup(user_uuid UUID, user_email TEXT, user_name TEXT DEFAULT NULL)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    verification_code TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
    new_code TEXT;
BEGIN
    -- First, try to confirm the user in auth.users
    UPDATE auth.users 
    SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = user_uuid;
    
    -- Check if profile exists
    SELECT * INTO profile_record
    FROM public.profiles
    WHERE public.profiles.user_id = user_uuid::TEXT;
    
    IF NOT FOUND THEN
        -- Create profile if it doesn't exist
        new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
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
            user_uuid::TEXT,
            user_email,
            COALESCE(user_name, user_email),
            false,
            new_code,
            NOW() + INTERVAL '15 minutes',
            0,
            NOW(),
            NOW()
        );
        
        RETURN QUERY SELECT true, user_uuid::TEXT, new_code, 'Profile created successfully'::TEXT;
    ELSE
        -- Profile exists, return existing code or generate new one
        IF profile_record.email_verification_code IS NULL OR profile_record.email_verification_expires < NOW() THEN
            new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
            
            UPDATE public.profiles
            SET 
                email_verification_code = new_code,
                email_verification_expires = NOW() + INTERVAL '15 minutes',
                verification_attempts = verification_attempts + 1,
                updated_at = NOW()
            WHERE public.profiles.user_id = user_uuid::TEXT;
        ELSE
            new_code := profile_record.email_verification_code;
        END IF;
        
        RETURN QUERY SELECT true, user_uuid::TEXT, new_code, 'Profile updated successfully'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 6. GRANT PERMISSIONS
-- ===============================

GRANT EXECUTE ON FUNCTION public.generate_verification_code(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_email_code(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resend_verification_code(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_password_reset_code(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_code(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_setup(UUID, TEXT, TEXT) TO anon, authenticated;

-- ===============================
-- 7. CREATE INDEXES
-- ===============================

CREATE INDEX IF NOT EXISTS idx_profiles_verification_code ON public.profiles(email_verification_code);
CREATE INDEX IF NOT EXISTS idx_profiles_password_reset_code ON public.profiles(password_reset_code);

-- ===============================
-- 8. VERIFICATION MESSAGE
-- ===============================

SELECT 
    'Verification code system setup complete' as status,
    'All functions updated to use 6-digit codes with 15-minute expiry' as message;