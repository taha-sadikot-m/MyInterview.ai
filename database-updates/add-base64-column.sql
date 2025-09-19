-- Add file_base64 column to resumes table and make file_url nullable
-- This will store the PDF file as base64 data directly in the database
-- Run this in your Supabase SQL Editor

-- Step 1: Add the new file_base64 column
ALTER TABLE resumes 
ADD COLUMN file_base64 TEXT;

-- Step 2: Make file_url nullable since we're now using base64 storage
ALTER TABLE resumes 
ALTER COLUMN file_url DROP NOT NULL;

-- Step 3: Add comments to the columns
COMMENT ON COLUMN resumes.file_base64 IS 'Base64 encoded PDF file data for direct OCR processing';
COMMENT ON COLUMN resumes.file_url IS 'Legacy file URL - now nullable as we use base64 storage';

-- Step 4: Update existing records to have NULL file_url if needed (optional)
-- UPDATE resumes SET file_url = NULL WHERE file_base64 IS NOT NULL;

-- Step 5: Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resumes' 
  AND column_name IN ('file_url', 'file_base64')
ORDER BY column_name;