-- IMMEDIATE FIX: Make file_url column nullable
-- Run this in your Supabase SQL Editor to fix the current error

-- Remove the NOT NULL constraint from file_url column
ALTER TABLE resumes 
ALTER COLUMN file_url DROP NOT NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resumes' 
  AND column_name = 'file_url';