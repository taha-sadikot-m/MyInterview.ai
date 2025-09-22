-- Authentication Setup Migration
-- This script ensures proper Supabase Auth integration and user profile management
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- 1. CLEAN UP EXISTING SCHEMA
-- ===============================

-- Drop existing custom users table if it exists (we'll use Supabase's auth.users)
-- First, we need to handle foreign key dependencies

-- Update foreign key references to use auth.users instead of public.users
-- Only update existing tables and columns
DO $$
BEGIN
    -- Update mock_interviews table user_id reference (if table and column exist)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mock_interviews') 
       AND EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'mock_interviews' AND column_name = 'user_id' AND data_type = 'uuid') THEN
        ALTER TABLE public.mock_interviews ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    END IF;
    
    -- Update resumes table user_id reference (if table and column exist)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resumes') 
       AND EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'resumes' AND column_name = 'user_id' AND data_type = 'uuid') THEN
        ALTER TABLE public.resumes ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    END IF;
    
    -- Update job_descriptions table user_id reference (if table and column exist)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'job_descriptions') 
       AND EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'job_descriptions' AND column_name = 'user_id' AND data_type = 'uuid') THEN
        ALTER TABLE public.job_descriptions ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    END IF;
    
    -- Update user_profiles table user_id reference (if table and column exist)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') 
       AND EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'user_id' AND data_type = 'uuid') THEN
        ALTER TABLE public.user_profiles ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    END IF;
END $$;

-- ===============================
-- 2. CREATE/UPDATE USER PROFILES TABLE
-- ===============================

-- Create or update profiles table for extended user information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL, -- References auth.users.id
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    college TEXT,
    graduation_year INTEGER,
    field_of_study TEXT,
    experience_level TEXT CHECK (experience_level IN ('fresher', 'experienced')),
    target_companies TEXT[],
    preferred_roles TEXT[],
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
    email_verified BOOLEAN DEFAULT false,
    profile_completed BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing profiles table if they don't exist
DO $$
BEGIN
    -- Add email_verified column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='email_verified') THEN
        ALTER TABLE public.profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
    END IF;
    
    -- Add profile_completed column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='profile_completed') THEN
        ALTER TABLE public.profiles ADD COLUMN profile_completed BOOLEAN DEFAULT false;
    END IF;
    
    -- Add last_login column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='last_login') THEN
        ALTER TABLE public.profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add subscription_tier column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='subscription_tier') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free' 
            CHECK (subscription_tier IN ('free', 'premium', 'enterprise'));
    END IF;
    
    -- Ensure all other required columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='preferences') THEN
        ALTER TABLE public.profiles ADD COLUMN preferences JSONB DEFAULT '{}';
    END IF;
END $$;

-- ===============================
-- 3. CREATE TRIGGER FUNCTION FOR AUTO PROFILE CREATION
-- ===============================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        avatar_url,
        email_verified,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email_confirmed_at IS NOT NULL,
        NEW.created_at,
        NEW.updated_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================
-- 4. CREATE TRIGGER FOR PROFILE UPDATES
-- ===============================

-- Function to automatically update profile when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET
        email = NEW.email,
        email_verified = NEW.email_confirmed_at IS NOT NULL,
        updated_at = NEW.updated_at
    WHERE user_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for automatic profile updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- ===============================
-- 5. ENABLE ROW LEVEL SECURITY
-- ===============================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::TEXT = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

-- ===============================
-- 6. UPDATE EXISTING TABLE POLICIES
-- ===============================

-- Update policies for other tables to use auth.uid()
-- Only update policies for existing tables
DO $$
DECLARE
    table_name TEXT;
    tables_to_check TEXT[] := ARRAY['mock_interviews', 'resumes', 'job_descriptions'];
BEGIN
    FOREACH table_name IN ARRAY tables_to_check
    LOOP
        -- Only proceed if table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' AND table_name = table_name) THEN
            
            -- Enable RLS on the table
            EXECUTE format('ALTER TABLE public.%s ENABLE ROW LEVEL SECURITY', table_name);
            
            -- Drop existing policies (ignore errors if they don't exist)
            BEGIN
                EXECUTE format('DROP POLICY IF EXISTS "Users can manage own %s" ON public.%s', table_name, table_name);
                EXECUTE format('DROP POLICY IF EXISTS "Enable all for anon users" ON public.%s', table_name);
                EXECUTE format('DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.%s', table_name);
            EXCEPTION
                WHEN OTHERS THEN
                    -- Ignore errors if policies don't exist
                    NULL;
            END;
            
            -- Create new policies using auth.uid() only if user_id column exists
            IF EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = table_name AND column_name = 'user_id') THEN
                EXECUTE format('CREATE POLICY "Users can manage own %s" ON public.%s FOR ALL USING (auth.uid()::TEXT = user_id)', table_name, table_name);
            END IF;
        END IF;
    END LOOP;
END $$;

-- ===============================
-- 7. CREATE HELPFUL FUNCTIONS
-- ===============================

-- Function to get user profile with auth info
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE (
    id UUID,
    user_id TEXT,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    college TEXT,
    graduation_year INTEGER,
    field_of_study TEXT,
    experience_level TEXT,
    target_companies TEXT[],
    preferred_roles TEXT[],
    subscription_tier TEXT,
    email_verified BOOLEAN,
    profile_completed BOOLEAN,
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        p.email,
        p.full_name,
        p.avatar_url,
        p.phone,
        p.college,
        p.graduation_year,
        p.field_of_study,
        p.experience_level,
        p.target_companies,
        p.preferred_roles,
        p.subscription_tier,
        p.email_verified,
        p.profile_completed,
        p.last_login,
        p.preferences,
        p.created_at,
        p.updated_at
    FROM public.profiles p
    WHERE p.user_id = user_uuid::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last login timestamp
CREATE OR REPLACE FUNCTION public.update_last_login(user_uuid UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET last_login = NOW(), updated_at = NOW()
    WHERE user_id = user_uuid::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- 8. CREATE INDEXES
-- ===============================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login);

-- ===============================
-- 9. GRANT PERMISSIONS
-- ===============================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_last_login(UUID) TO anon, authenticated;

-- ===============================
-- 10. VERIFICATION
-- ===============================

-- Verify the setup
SELECT 
    'Profiles table' as component,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
         THEN '✅ Created' 
         ELSE '❌ Missing' 
    END as status;

-- Check RLS is enabled
SELECT 
    'RLS on profiles' as component,
    CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') 
         THEN '✅ Enabled' 
         ELSE '❌ Disabled' 
    END as status;

-- Check triggers exist
SELECT 
    'Auth triggers' as component,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated'))
         THEN '✅ Created' 
         ELSE '❌ Missing' 
    END as status;

-- Final completion message
DO $$
BEGIN
    RAISE NOTICE 'Authentication setup migration completed successfully!';
END $$;