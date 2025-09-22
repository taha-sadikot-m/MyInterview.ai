-- Custom Email Verification Setup
-- This script adds custom email verification functionality
-- Run this in Supabase SQL Editor

-- ===============================
-- 1. ADD VERIFICATION FIELDS TO PROFILES
-- ===============================

-- Add verification token and status fields to profiles table
DO $$
BEGIN
    -- Add email_verification_token column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='email_verification_token') THEN
        ALTER TABLE public.profiles ADD COLUMN email_verification_token TEXT;
    END IF;
    
    -- Add email_verification_expires column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='email_verification_expires') THEN
        ALTER TABLE public.profiles ADD COLUMN email_verification_expires TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add verification_attempts column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='verification_attempts') THEN
        ALTER TABLE public.profiles ADD COLUMN verification_attempts INTEGER DEFAULT 0;
    END IF;
END $$;

-- ===============================
-- 2. UPDATE PROFILE CREATION TRIGGER
-- ===============================

-- Update the handle_new_user function to not auto-verify emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    verification_token TEXT;
BEGIN
    -- Generate a random verification token
    verification_token := encode(gen_random_bytes(32), 'hex');
    
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        avatar_url,
        email_verified,
        email_verification_token,
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
        false, -- Start with unverified email
        verification_token,
        NOW() + INTERVAL '24 hours', -- Token expires in 24 hours
        0,
        NEW.created_at,
        NEW.updated_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 3. CREATE EMAIL VERIFICATION FUNCTIONS
-- ===============================

-- Function to generate new verification token
CREATE OR REPLACE FUNCTION public.generate_verification_token(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    new_token TEXT;
BEGIN
    -- Generate a new random token
    new_token := encode(gen_random_bytes(32), 'hex');
    
    -- Update the user's profile with new token
    UPDATE public.profiles
    SET 
        email_verification_token = new_token,
        email_verification_expires = NOW() + INTERVAL '24 hours',
        verification_attempts = verification_attempts + 1,
        updated_at = NOW()
    WHERE user_id = user_uuid::TEXT;
    
    RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify email with token
CREATE OR REPLACE FUNCTION public.verify_email_token(token TEXT)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profile with matching token
    SELECT * INTO profile_record
    FROM public.profiles
    WHERE email_verification_token = token
    AND email_verification_expires > NOW()
    AND email_verified = false;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Invalid or expired verification token'::TEXT;
        RETURN;
    END IF;
    
    -- Mark email as verified
    UPDATE public.profiles
    SET 
        email_verified = true,
        email_verification_token = NULL,
        email_verification_expires = NULL,
        updated_at = NOW()
    WHERE user_id = profile_record.user_id;
    
    RETURN QUERY SELECT true, profile_record.user_id, 'Email verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resend verification email (generates new token)
CREATE OR REPLACE FUNCTION public.resend_verification_token(user_email TEXT)
RETURNS TABLE (
    success BOOLEAN,
    token TEXT,
    user_id TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
    new_token TEXT;
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
    
    -- Generate new token
    new_token := public.generate_verification_token(profile_record.user_id::UUID);
    
    RETURN QUERY SELECT true, new_token, profile_record.user_id, 'New verification token generated'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 4. CREATE INDEXES
-- ===============================

CREATE INDEX IF NOT EXISTS idx_profiles_verification_token ON public.profiles(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);

-- ===============================
-- 5. GRANT PERMISSIONS
-- ===============================

GRANT EXECUTE ON FUNCTION public.generate_verification_token(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_email_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resend_verification_token(TEXT) TO anon, authenticated;

-- ===============================
-- 6. VERIFICATION
-- ===============================

SELECT 
    'Custom Email Verification Setup Complete' as status,
    'Verification tokens, functions, and triggers created successfully' as message;