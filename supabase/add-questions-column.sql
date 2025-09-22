-- Add missing questions column to mock_interviews table
-- This column is required by the N8N workflow to store generated interview questions

DO $$ 
BEGIN
    -- Add questions column to mock_interviews table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='questions') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN questions JSONB DEFAULT '{}';
        COMMENT ON COLUMN public.mock_interviews.questions IS 'Generated AI interview questions stored as JSONB';
    ELSE
        RAISE NOTICE 'Column questions already exists in mock_interviews table';
    END IF;

    -- Add error_message column for storing workflow errors
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='error_message') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN error_message TEXT;
        COMMENT ON COLUMN public.mock_interviews.error_message IS 'Error message if workflow fails';
    ELSE
        RAISE NOTICE 'Column error_message already exists in mock_interviews table';
    END IF;

    RAISE NOTICE 'Successfully added missing columns to mock_interviews table';
END $$;

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'mock_interviews' 
AND column_name IN ('questions', 'error_message')
ORDER BY column_name;