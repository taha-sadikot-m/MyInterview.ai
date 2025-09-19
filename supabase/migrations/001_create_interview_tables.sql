-- Create users table (if not exists from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table for extended user information
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    phone TEXT,
    college TEXT,
    graduation_year INTEGER,
    field_of_study TEXT,
    experience_level TEXT CHECK (experience_level IN ('fresher', 'experienced')),
    target_companies TEXT[], -- Array of preferred companies
    preferred_roles TEXT[], -- Array of preferred job roles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table to store uploaded resume information
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Supabase storage URL
    file_size INTEGER, -- File size in bytes
    extracted_data JSONB, -- Parsed resume data (skills, experience, education, etc.)
    parsing_status TEXT DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
    parsing_error TEXT, -- Error message if parsing failed
    is_active BOOLEAN DEFAULT true, -- Whether this is the active resume
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job descriptions table for custom job postings
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    skills_required TEXT[],
    experience_level TEXT,
    extracted_keywords TEXT[], -- AI-extracted important keywords/skills
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mock interviews table to store interview sessions
CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    interview_type TEXT DEFAULT 'custom' CHECK (interview_type IN ('predefined', 'custom')),
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    total_questions INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    overall_score DECIMAL(3,2), -- Overall interview score (0.00 to 10.00)
    competency_scores JSONB, -- Scores for different competencies
    strengths TEXT[],
    improvements TEXT[],
    feedback_summary TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview questions table to store individual questions and responses
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT CHECK (question_type IN ('behavioral', 'technical', 'situational', 'company_specific')),
    question_category TEXT, -- e.g., 'communication', 'problem_solving', 'leadership'
    ai_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview responses table to store user answers
CREATE TABLE IF NOT EXISTS public.interview_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    response_text TEXT, -- Transcribed or typed response
    audio_url TEXT, -- URL to audio recording if available
    response_duration INTEGER, -- Duration in seconds
    ai_score DECIMAL(3,2), -- AI-generated score for this response (0.00 to 10.00)
    ai_feedback TEXT, -- AI-generated feedback for this specific response
    key_points TEXT[], -- AI-extracted key points from the response
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview chat history for storing conversation flow
CREATE TABLE IF NOT EXISTS public.interview_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    message_type TEXT CHECK (message_type IN ('question', 'response', 'feedback', 'system')),
    sender TEXT CHECK (sender IN ('ai', 'user', 'system')),
    content TEXT NOT NULL,
    message_order INTEGER NOT NULL,
    metadata JSONB, -- Additional data like audio URLs, timestamps, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON public.resumes(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_id ON public.mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_status ON public.mock_interviews(user_id, status);
CREATE INDEX IF NOT EXISTS idx_interview_questions_mock_interview_id ON public.interview_questions(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_mock_interview_id ON public.interview_responses(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_chats_mock_interview_id ON public.interview_chats(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_chats_message_order ON public.interview_chats(mock_interview_id, message_order);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_chats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own user_profiles" ON public.user_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own job_descriptions" ON public.job_descriptions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mock_interviews" ON public.mock_interviews FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view interview_questions for their interviews" ON public.interview_questions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.mock_interviews WHERE id = mock_interview_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage interview_responses for their interviews" ON public.interview_responses FOR ALL
USING (EXISTS (SELECT 1 FROM public.mock_interviews WHERE id = mock_interview_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage interview_chats for their interviews" ON public.interview_chats FOR ALL
USING (EXISTS (SELECT 1 FROM public.mock_interviews WHERE id = mock_interview_id AND user_id = auth.uid()));

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates (drop if exists first)
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_descriptions_updated_at ON public.job_descriptions;
CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON public.job_descriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mock_interviews_updated_at ON public.mock_interviews;
CREATE TRIGGER update_mock_interviews_updated_at BEFORE UPDATE ON public.mock_interviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();