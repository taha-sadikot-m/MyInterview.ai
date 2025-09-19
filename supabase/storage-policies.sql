-- Storage policies for the resumes bucket
-- NOTE: Run these in Supabase Dashboard -> Storage -> Policies, not SQL Editor

-- Alternative: Create bucket and policies through Supabase Dashboard UI
-- 1. Go to Storage -> Buckets
-- 2. Create bucket named 'resumes' with public access
-- 3. Go to Storage -> Policies 
-- 4. Create these policies using the UI:

-- Policy 1: "Public read access"
-- Operation: SELECT
-- Target: storage.objects
-- Policy definition: bucket_id = 'resumes'

-- Policy 2: "Public upload access"  
-- Operation: INSERT
-- Target: storage.objects
-- Policy definition: bucket_id = 'resumes'

-- Policy 3: "Public update access"
-- Operation: UPDATE
-- Target: storage.objects  
-- Policy definition: bucket_id = 'resumes'

-- Policy 4: "Public delete access"
-- Operation: DELETE
-- Target: storage.objects
-- Policy definition: bucket_id = 'resumes'

-- OR use these SQL commands in the SQL Editor (if you have admin access):
-- These should work if run as the project owner:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (may require superuser privileges)
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects'
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;