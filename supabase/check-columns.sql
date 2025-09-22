-- Quick test to check if the questions column exists
-- Run this BEFORE the main migration to see if the column is missing

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'mock_interviews' 
AND column_name IN ('questions', 'error_message')
ORDER BY column_name;

-- If this returns no rows, the columns are missing and you MUST run add-questions-column.sql