-- Critical Fix: Disable Supabase Email Confirmation and Fix User Creation
-- Run this in Supabase SQL Editor

-- ===============================
-- 1. UPDATE AUTH CONFIGURATION
-- ===============================

-- First, we need to make sure new users are automatically confirmed
-- Update the auth.users trigger to auto-confirm users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    verification_token TEXT;
BEGIN
    -- Generate a random verification token
    verification_token := encode(gen_random_bytes(32), 'hex');
    
    -- Auto-confirm the user in auth.users if not already confirmed
    IF NEW.email_confirmed_at IS NULL THEN
        UPDATE auth.users 
        SET email_confirmed_at = NOW()
        WHERE id = NEW.id;
    END IF;
    
    -- Create profile with verification token
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
        false, -- Our custom verification, not Supabase's
        verification_token,
        NOW() + INTERVAL '24 hours',
        0,
        NEW.created_at,
        NEW.updated_at
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 2. ENSURE TRIGGER EXISTS
-- ===============================

-- Drop and recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ===============================
-- 3. CREATE HELPER FUNCTION FOR CLIENT
-- ===============================

-- Function to manually confirm user and create profile if needed
CREATE OR REPLACE FUNCTION public.ensure_user_setup(user_uuid UUID, user_email TEXT, user_name TEXT DEFAULT NULL)
RETURNS TABLE (
    success BOOLEAN,
    user_id TEXT,
    verification_token TEXT,
    message TEXT
) AS $$
DECLARE
    profile_record RECORD;
    new_token TEXT;
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
        new_token := encode(gen_random_bytes(32), 'hex');
        
        INSERT INTO public.profiles (
            user_id,
            email,
            full_name,
            email_verified,
            email_verification_token,
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
            new_token,
            NOW() + INTERVAL '24 hours',
            0,
            NOW(),
            NOW()
        );
        
        RETURN QUERY SELECT true, user_uuid::TEXT, new_token, 'Profile created successfully'::TEXT;
    ELSE
        -- Profile exists, return existing token or generate new one
        IF profile_record.email_verification_token IS NULL OR profile_record.email_verification_expires < NOW() THEN
            new_token := encode(gen_random_bytes(32), 'hex');
            
            UPDATE public.profiles
            SET 
                email_verification_token = new_token,
                email_verification_expires = NOW() + INTERVAL '24 hours',
                verification_attempts = verification_attempts + 1,
                updated_at = NOW()
            WHERE public.profiles.user_id = user_uuid::TEXT;
        ELSE
            new_token := profile_record.email_verification_token;
        END IF;
        
        RETURN QUERY SELECT true, user_uuid::TEXT, new_token, 'Profile updated successfully'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 4. GRANT PERMISSIONS
-- ===============================

GRANT EXECUTE ON FUNCTION public.ensure_user_setup(UUID, TEXT, TEXT) TO anon, authenticated;

-- ===============================
-- 5. VERIFICATION MESSAGE
-- ===============================

SELECT 
    'Critical database fixes applied' as status,
    'Auto-confirmation and profile creation setup complete' as message;