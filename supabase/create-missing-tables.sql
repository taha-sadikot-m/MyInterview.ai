-- Create missing tables for the interview system
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    parsing_status TEXT DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
    parsed_content JSONB,
    skills TEXT[],
    experience_years INTEGER,
    education JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create job_descriptions table
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    description TEXT,
    requirements TEXT[],
    skills_required TEXT[],
    experience_level TEXT,
    salary_range TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create mock_interviews table
CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]',
    responses JSONB DEFAULT '[]',
    feedback JSONB,
    overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create interview_questions table
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'behavioral' CHECK (question_type IN ('technical', 'behavioral', 'situational', 'company_specific')),
    difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    expected_answer TEXT,
    user_response TEXT,
    response_score INTEGER CHECK (response_score BETWEEN 0 AND 100),
    feedback TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create interview_sessions table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    session_status TEXT DEFAULT 'active' CHECK (session_status IN ('active', 'paused', 'completed', 'terminated')),
    current_question_index INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    total_duration_minutes INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create user_profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create analytics table for tracking
CREATE TABLE IF NOT EXISTS public.interview_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create performance_metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    communication_score INTEGER CHECK (communication_score BETWEEN 0 AND 100),
    technical_score INTEGER CHECK (technical_score BETWEEN 0 AND 100),
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 0 AND 100),
    strengths TEXT[],
    areas_for_improvement TEXT[],
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_active ON public.resumes(is_active);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_id ON public.mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_status ON public.mock_interviews(status);
CREATE INDEX IF NOT EXISTS idx_interview_questions_mock_interview_id ON public.interview_questions(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_analytics_user_id ON public.interview_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);

-- Enable RLS on all tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all tables (for development)
-- In production, you'd want more restrictive policies

-- Resumes policies
DROP POLICY IF EXISTS "Users can manage their own resumes" ON public.resumes;
CREATE POLICY "Users can manage their own resumes" ON public.resumes 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Job descriptions policies
DROP POLICY IF EXISTS "Users can manage their own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can manage their own job descriptions" ON public.job_descriptions 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Mock interviews policies
DROP POLICY IF EXISTS "Users can manage their own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can manage their own mock interviews" ON public.mock_interviews 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Interview questions policies
DROP POLICY IF EXISTS "Users can manage interview questions" ON public.interview_questions;
CREATE POLICY "Users can manage interview questions" ON public.interview_questions 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Interview sessions policies
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.interview_sessions;
CREATE POLICY "Users can manage their own sessions" ON public.interview_sessions 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Profiles policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" ON public.profiles 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Analytics policies
DROP POLICY IF EXISTS "Users can manage their own analytics" ON public.interview_analytics;
CREATE POLICY "Users can manage their own analytics" ON public.interview_analytics 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Performance metrics policies
DROP POLICY IF EXISTS "Users can manage their own metrics" ON public.performance_metrics;
CREATE POLICY "Users can manage their own metrics" ON public.performance_metrics 
FOR ALL TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Verification: Check that all tables were created
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;