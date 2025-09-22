# Fix Interview GUI Loading Issue

## Problem
The interview GUI was not loading with AI-generated questions because the database was missing the `questions` column that the N8N workflow tries to update.

## Solution Overview
1. **Add missing database column** - The workflow stores questions in a `questions` JSONB column
2. **Update frontend logic** - Fetch real AI questions instead of always using sample questions
3. **Add proper error handling** - Fallback to sample questions if AI generation fails

## Steps to Complete the Fix

### 1. Add Database Column (REQUIRED)
Run this SQL in your Supabase SQL Editor:

```sql
-- Add missing questions column to mock_interviews table
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
```

### 2. Updated Files
The following files have been updated with the fix:

- **`src/lib/interview-api.ts`**:
  - Added `fetchInterviewQuestions()` function to retrieve AI-generated questions from database
  - Updated `triggerMockInterview()` to properly handle workflow responses
  
- **`src/pages/MyInterviewWorld.tsx`**:
  - Modified `handleStartInterview()` to wait for AI questions and fetch them from database
  - Added retry logic with 30-second timeout
  - Proper fallback to sample questions if AI generation fails
  - User feedback via toasts about question source (AI vs sample)

- **`src/integrations/supabase/types.ts`**:
  - Added `questions: Json | null` and `error_message: string | null` to mock_interviews table type

- **`supabase/add-questions-column.sql`**:
  - New migration script to add missing database columns

## How It Works Now

1. **User starts interview** → Frontend triggers workflow
2. **Workflow executes** → AI generates questions and stores them in database
3. **Frontend waits** → Polls database every 3 seconds for up to 30 seconds
4. **Questions retrieved** → Uses AI questions if available, falls back to samples if not
5. **Interview begins** → With either AI-generated or sample questions

## Error Handling

- **Workflow fails**: Falls back to sample questions
- **Database timeout**: Falls back to sample questions after 30 seconds
- **Network issues**: Falls back to sample questions
- **User always informed**: Toast messages indicate whether using AI or sample questions

## Testing

After running the SQL migration:

1. Upload a resume and create a job description
2. Start a mock interview
3. You should see "AI is generating your personalized interview questions..." message
4. After a few seconds, it should either show "AI generated X personalized interview questions!" or fall back to samples
5. The interview should begin with the appropriate questions

## Troubleshooting

If issues persist:

1. **Check Supabase logs** for any database errors
2. **Check N8N execution logs** to see if workflow is completing successfully  
3. **Check browser console** for any JavaScript errors
4. **Verify database schema** - make sure the `questions` column was added successfully

The system is now robust and will work whether the AI workflow succeeds or fails.