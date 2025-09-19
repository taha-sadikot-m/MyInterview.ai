-- Fix storage policies and table permissions
-- Run this in Supabase SQL Editor

-- PART 1: Fix Database Table Permissions
-- First, let's check what tables exist and their owners
SELECT schemaname, tablename, tableowner FROM pg_tables WHERE schemaname = 'public';

-- Grant necessary permissions to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Enable RLS on all tables and create permissive policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    LOOP
        -- Enable RLS
        EXECUTE 'ALTER TABLE public.' || r.tablename || ' ENABLE ROW LEVEL SECURITY';
        
        -- Drop existing policies to avoid conflicts
        EXECUTE 'DROP POLICY IF EXISTS "Enable all for anon users" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.' || r.tablename;
        
        -- Create permissive policies for anon users
        EXECUTE 'CREATE POLICY "Enable all for anon users" ON public.' || r.tablename || ' FOR ALL TO anon USING (true) WITH CHECK (true)';
        
        -- Create permissive policies for authenticated users  
        EXECUTE 'CREATE POLICY "Enable all for authenticated users" ON public.' || r.tablename || ' FOR ALL TO authenticated USING (true) WITH CHECK (true)';
    END LOOP;
END $$;

-- PART 2: Fix Storage Policies
-- Drop existing storage policies that might be conflicting
DROP POLICY IF EXISTS "Enable insert for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable select for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for public users" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete resume files" ON storage.objects;

-- Create new storage policies specifically for the resumes bucket
CREATE POLICY "Allow public uploads to resumes bucket" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow public reads from resumes bucket" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'resumes');

CREATE POLICY "Allow public updates to resumes bucket" ON storage.objects
FOR UPDATE TO anon, authenticated
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow public deletes from resumes bucket" ON storage.objects
FOR DELETE TO anon, authenticated
USING (bucket_id = 'resumes');

-- PART 3: Fix Storage Bucket Policies
DROP POLICY IF EXISTS "Public bucket access" ON storage.buckets;
CREATE POLICY "Public bucket access" ON storage.buckets 
FOR ALL TO anon, authenticated 
USING (id = 'resumes') 
WITH CHECK (id = 'resumes');

-- PART 4: Verification Queries
-- Check database table policies
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check storage object policies
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check storage bucket policies
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'buckets' AND schemaname = 'storage';

-- Check that RLS is enabled on tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname IN ('public', 'storage') AND rowsecurity = true;