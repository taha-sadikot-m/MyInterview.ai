-- QUICK FIX for interview_questions NOT NULL constraint error
-- Run this in Supabase SQL Editor to fix the existing table
-- This will allow NULL values for question_number and set a default

-- Step 1: Add a default value to existing question_number column
ALTER TABLE public.interview_questions 
ALTER COLUMN question_number SET DEFAULT 1;

-- Step 2: Drop the NOT NULL constraint
ALTER TABLE public.interview_questions 
ALTER COLUMN question_number DROP NOT NULL;

-- Step 3: Update any existing NULL values to have a default
UPDATE public.interview_questions 
SET question_number = 1 
WHERE question_number IS NULL;

-- Step 4: Verify the change
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'interview_questions' 
AND column_name = 'question_number';

-- Success message
SELECT '✅ Fixed interview_questions table constraint!' as status,
       'question_number column now allows NULL values with default = 1' as details,
       'Interview process should work without errors now' as result;