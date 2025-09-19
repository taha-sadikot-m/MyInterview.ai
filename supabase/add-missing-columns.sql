-- Comprehensive database update to match code requirements
-- Run this in Supabase SQL Editor

-- Add missing columns to ALL tables based on code analysis
DO $$ 
BEGIN
    -- ===== MOCK_INTERVIEWS TABLE =====
    -- Add interview_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='interview_type') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN interview_type TEXT CHECK (interview_type IN ('predefined', 'custom')) DEFAULT 'predefined';
    END IF;
    
    -- Add company_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='company_name') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN company_name TEXT NOT NULL DEFAULT 'Unknown Company';
    END IF;
    
    -- Add role_title column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='role_title') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN role_title TEXT NOT NULL DEFAULT 'Unknown Role';
    END IF;
    
    -- Add status column with proper enum values
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='status') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress';
    END IF;
    
    -- Add total_questions column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='total_questions') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN total_questions INTEGER DEFAULT 6;
    END IF;
    
    -- Add questions_answered column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='questions_answered') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN questions_answered INTEGER DEFAULT 0;
    END IF;
    
    -- Add overall_score column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='overall_score') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100);
    END IF;
    
    -- Add competency_scores column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='competency_scores') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN competency_scores JSONB;
    END IF;
    
    -- Add strengths column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='strengths') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN strengths TEXT[];
    END IF;
    
    -- Add improvements column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='improvements') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN improvements TEXT[];
    END IF;
    
    -- Add feedback_summary column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='feedback_summary') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN feedback_summary TEXT;
    END IF;
    
    -- Add started_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='started_at') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add completed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='mock_interviews' AND column_name='completed_at') THEN
        ALTER TABLE public.mock_interviews ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- ===== INTERVIEW_QUESTIONS TABLE =====
    -- Add question_number column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='interview_questions' AND column_name='question_number') THEN
        ALTER TABLE public.interview_questions ADD COLUMN question_number INTEGER NOT NULL DEFAULT 1;
    END IF;
    
    -- Add question_text column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='interview_questions' AND column_name='question_text') THEN
        ALTER TABLE public.interview_questions ADD COLUMN question_text TEXT NOT NULL DEFAULT 'Sample question';
    END IF;
    
    -- Add question_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='interview_questions' AND column_name='question_type') THEN
        ALTER TABLE public.interview_questions ADD COLUMN question_type TEXT CHECK (question_type IN ('behavioral', 'technical', 'situational', 'company_specific'));
    END IF;
    
    -- Add question_category column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='interview_questions' AND column_name='question_category') THEN
        ALTER TABLE public.interview_questions ADD COLUMN question_category TEXT;
    END IF;
    
    -- Add ai_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='interview_questions' AND column_name='ai_generated') THEN
        ALTER TABLE public.interview_questions ADD COLUMN ai_generated BOOLEAN DEFAULT false;
    END IF;

    -- ===== RESUMES TABLE =====
    -- Add extracted_data column (for parsed resume content)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resumes' AND column_name='extracted_data') THEN
        ALTER TABLE public.resumes ADD COLUMN extracted_data JSONB;
    END IF;

    -- ===== USER_PROFILES TABLE =====
    -- Add phone column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
    
    -- Add college column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='college') THEN
        ALTER TABLE public.profiles ADD COLUMN college TEXT;
    END IF;
    
    -- Add graduation_year column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='graduation_year') THEN
        ALTER TABLE public.profiles ADD COLUMN graduation_year INTEGER;
    END IF;
    
    -- Add field_of_study column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='field_of_study') THEN
        ALTER TABLE public.profiles ADD COLUMN field_of_study TEXT;
    END IF;
    
    -- Add experience_level column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='experience_level') THEN
        ALTER TABLE public.profiles ADD COLUMN experience_level TEXT CHECK (experience_level IN ('fresher', 'experienced'));
    END IF;
    
    -- Add target_companies column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='target_companies') THEN
        ALTER TABLE public.profiles ADD COLUMN target_companies TEXT[];
    END IF;
    
    -- Add preferred_roles column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='preferred_roles') THEN
        ALTER TABLE public.profiles ADD COLUMN preferred_roles TEXT[];
    END IF;

    -- ===== JOB_DESCRIPTIONS TABLE =====
    -- Add extracted_keywords column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='job_descriptions' AND column_name='extracted_keywords') THEN
        ALTER TABLE public.job_descriptions ADD COLUMN extracted_keywords TEXT[];
    END IF;

END $$;

-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.interview_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    response_text TEXT,
    audio_url TEXT,
    response_duration INTEGER,
    ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
    ai_feedback TEXT,
    key_points TEXT[],
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    message_type TEXT CHECK (message_type IN ('question', 'response', 'feedback', 'system')) NOT NULL,
    sender TEXT CHECK (sender IN ('ai', 'user', 'system')) NOT NULL,
    content TEXT NOT NULL,
    message_order INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove default values after adding the columns
ALTER TABLE public.mock_interviews ALTER COLUMN company_name DROP DEFAULT;
ALTER TABLE public.mock_interviews ALTER COLUMN role_title DROP DEFAULT;
ALTER TABLE public.interview_questions ALTER COLUMN question_text DROP DEFAULT;

-- Enable RLS on new tables
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
DROP POLICY IF EXISTS "Users can manage interview responses" ON public.interview_responses;
CREATE POLICY "Users can manage interview responses" ON public.interview_responses 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage interview chats" ON public.interview_chats;
CREATE POLICY "Users can manage interview chats" ON public.interview_chats 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_responses_question_id ON public.interview_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_mock_interview_id ON public.interview_responses(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_chats_mock_interview_id ON public.interview_chats(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_chats_message_order ON public.interview_chats(message_order);

-- Verification: Check all required columns exist
SELECT 
    t.table_name,
    STRING_AGG(c.column_name, ', ' ORDER BY c.ordinal_position) as columns
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
AND t.table_name IN ('mock_interviews', 'interview_questions', 'interview_responses', 'interview_chats', 'resumes', 'profiles', 'job_descriptions')
GROUP BY t.table_name
ORDER BY t.table_name;