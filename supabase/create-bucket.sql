-- Create the resumes bucket and policies
-- Run this in Supabase SQL Editor

-- 1. Insert the bucket into storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes', 
  'resumes', 
  true, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete resume files" ON storage.objects;

-- 4. Create storage policies
CREATE POLICY "Anyone can upload resume files" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resume files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can update resume files" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can delete resume files" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'resumes');

-- 5. Check if bucket was created successfully
SELECT * FROM storage.buckets WHERE name = 'resumes';