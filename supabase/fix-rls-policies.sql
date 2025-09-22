-- Fix Row Level Security policies for custom authentication
-- This script updates RLS policies to allow our custom auth flow

-- First, let's see what policies exist (for debugging)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop existing problematic policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;

-- Create comprehensive RLS policies for custom authentication

-- 1. Allow anonymous users to insert profiles (for registration)
CREATE POLICY "Allow anonymous registration"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (true);

-- 2. Allow authenticated users to read their own profiles
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = email);

-- 3. Allow authenticated users to update their own profiles
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = email)
WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = email);

-- 4. Allow anonymous users to read profiles for login verification
CREATE POLICY "Allow anonymous login verification"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- 5. Allow anonymous users to update profiles for email verification
CREATE POLICY "Allow anonymous email verification"
ON public.profiles
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 6. Allow authenticated users to insert profiles (backup)
CREATE POLICY "Allow authenticated registration"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;

-- Also grant usage on the sequence if it exists
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;