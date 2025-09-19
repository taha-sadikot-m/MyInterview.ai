-- Quick fix for storage policies
-- Run this in Supabase SQL Editor

-- Create policies for storage.objects table
CREATE POLICY IF NOT EXISTS "Enable insert for public users" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY IF NOT EXISTS "Enable select for public users" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'resumes');

CREATE POLICY IF NOT EXISTS "Enable update for public users" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY IF NOT EXISTS "Enable delete for public users" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'resumes');