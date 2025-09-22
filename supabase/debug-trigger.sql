-- Debug the trigger and profile creation
-- Run this in Supabase SQL Editor to check if trigger exists and works

-- 1. Check if the trigger exists
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';

-- 2. Check if handle_new_user function exists
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Check if there are any profiles
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email_verified = false THEN 1 END) as unverified_profiles,
    COUNT(CASE WHEN email_verification_token IS NOT NULL THEN 1 END) as profiles_with_tokens
FROM public.profiles;

-- 5. Show recent profiles (if any)
SELECT 
    user_id,
    email,
    email_verified,
    email_verification_token IS NOT NULL as has_token,
    created_at
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;