-- Fix for ambiguous user_id column reference error
-- This script corrects the column references in the verification functions

-- Function to verify email with code (CORRECTED)
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
    FROM public.profiles
    WHERE email = user_email
    AND email_verification_code = verification_code
    AND email_verification_expires > NOW()
    AND COALESCE(email_verified, false) = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired verification code'::TEXT;
        RETURN;
    END IF;
    
    -- Mark email as verified (FIX: qualify column name)
    UPDATE public.profiles
    SET 
        email_verified = true,
        email_verification_code = NULL,
        email_verification_expires = NULL,
        updated_at = NOW()
    WHERE profiles.user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, profile_record.user_id, 'Email verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate password reset code (CORRECTED)
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
    AND COALESCE(email_verified, false) = true; -- Only allow reset for verified emails
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, 'Email not found or not verified'::TEXT;
        RETURN;
    END IF;
    
    -- Generate a new random 6-digit reset code
    reset_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Update the user's profile with reset code (FIX: qualify column name)
    UPDATE public.profiles
    SET 
        password_reset_code = reset_code,
        password_reset_expires = NOW() + INTERVAL '15 minutes',
        updated_at = NOW()
    WHERE profiles.user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, reset_code, profile_record.user_id, 'Password reset code generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify password reset code (CORRECTED)
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
    FROM public.profiles
    WHERE email = user_email
    AND password_reset_code = reset_code
    AND password_reset_expires > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired reset code'::TEXT;
        RETURN;
    END IF;
    
    -- Clear the reset code (one-time use) (FIX: qualify column name)
    UPDATE public.profiles
    SET 
        password_reset_code = NULL,
        password_reset_expires = NULL,
        updated_at = NOW()
    WHERE profiles.user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, profile_record.user_id, 'Reset code verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;