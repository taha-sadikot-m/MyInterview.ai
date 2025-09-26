-- Complete Database Setup Script for Voice Vanguard Vault
-- This script checks for existing tables and creates/updates them as needed
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================================================
-- FUNCTION TO CHECK AND CREATE TABLES
-- ==================================================

DO $$ 
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- ===============================
    -- 1. PROFILES TABLE (Main user profiles)
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating profiles table...';
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT UNIQUE NOT NULL, -- References auth.users.id
            email TEXT,
            full_name TEXT,
            avatar_url TEXT,
            phone TEXT,
            college TEXT,
            graduation_year INTEGER,
            field_of_study TEXT,
            experience_level TEXT CHECK (experience_level IN ('fresher', 'experienced')),
            target_companies TEXT[],
            preferred_roles TEXT[],
            subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
            email_verified BOOLEAN DEFAULT false,
            email_verification_token TEXT,
            email_verification_expires TIMESTAMP WITH TIME ZONE,
            verification_attempts INTEGER DEFAULT 0,
            password_reset_code TEXT,
            password_reset_expires TIMESTAMP WITH TIME ZONE,
            password_hash TEXT, -- For password reset functionality
            profile_completed BOOLEAN DEFAULT false,
            last_login TIMESTAMP WITH TIME ZONE,
            preferences JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        RAISE NOTICE 'Profiles table already exists, checking for missing columns...';
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_verification_token') THEN
            ALTER TABLE public.profiles ADD COLUMN email_verification_token TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_verification_expires') THEN
            ALTER TABLE public.profiles ADD COLUMN email_verification_expires TIMESTAMP WITH TIME ZONE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='verification_attempts') THEN
            ALTER TABLE public.profiles ADD COLUMN verification_attempts INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='password_reset_code') THEN
            ALTER TABLE public.profiles ADD COLUMN password_reset_code TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='password_reset_expires') THEN
            ALTER TABLE public.profiles ADD COLUMN password_reset_expires TIMESTAMP WITH TIME ZONE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='password_hash') THEN
            ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;
        END IF;
    END IF;

    -- ===============================
    -- 2. USERS TABLE (Base users - may be handled by Supabase auth)
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating users table...';
        CREATE TABLE public.users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- ===============================
    -- 3. USER_PROFILES TABLE (Extended user data)
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating user_profiles table...';
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            phone TEXT,
            college TEXT,
            graduation_year INTEGER,
            field_of_study TEXT,
            experience_level TEXT CHECK (experience_level IN ('fresher', 'experienced')),
            target_companies TEXT[],
            preferred_roles TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- ===============================
    -- 4. RESUMES TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'resumes'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating resumes table...';
        CREATE TABLE public.resumes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_url TEXT,
            file_base64 TEXT, -- Base64 encoded file for OCR processing
            file_size INTEGER,
            extracted_data JSONB, -- Parsed resume content
            parsing_status TEXT DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
            parsing_error TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add file_base64 column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resumes' AND column_name='file_base64') THEN
            ALTER TABLE public.resumes ADD COLUMN file_base64 TEXT;
        END IF;
    END IF;

    -- ===============================
    -- 5. JOB_DESCRIPTIONS TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'job_descriptions'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating job_descriptions table...';
        CREATE TABLE public.job_descriptions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            company_name TEXT NOT NULL,
            role_title TEXT NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT[],
            skills_required TEXT[],
            experience_level TEXT,
            extracted_keywords TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- ===============================
    -- 6. MOCK_INTERVIEWS TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'mock_interviews'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating mock_interviews table...';
        CREATE TABLE public.mock_interviews (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            resume_id UUID,
            job_description_id UUID,
            company_name TEXT NOT NULL,
            role_title TEXT NOT NULL,
            interview_type TEXT DEFAULT 'predefined' CHECK (interview_type IN ('predefined', 'custom')),
            status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
            total_questions INTEGER DEFAULT 0,
            questions_answered INTEGER DEFAULT 0,
            overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
            competency_scores JSONB,
            strengths TEXT[],
            improvements TEXT[],
            feedback_summary TEXT,
            questions JSONB, -- Stores the interview questions
            error_message TEXT,
            started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mock_interviews' AND column_name='interview_type') THEN
            ALTER TABLE public.mock_interviews ADD COLUMN interview_type TEXT DEFAULT 'predefined' CHECK (interview_type IN ('predefined', 'custom'));
        END IF;
    END IF;

    -- ===============================
    -- 7. INTERVIEW_QUESTIONS TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'interview_questions'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating interview_questions table...';
        CREATE TABLE public.interview_questions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            mock_interview_id UUID,
            question_number INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            question_type TEXT CHECK (question_type IN ('behavioral', 'technical', 'situational', 'company_specific')),
            question_category TEXT,
            competency TEXT, -- What competency this question tests
            difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
            expected_duration INTEGER, -- Expected answer duration in seconds
            ai_generated BOOLEAN DEFAULT false,
            follow_up_questions TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns (without NOT NULL constraints for existing tables)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='interview_questions' AND column_name='question_number') THEN
            ALTER TABLE public.interview_questions ADD COLUMN question_number INTEGER DEFAULT 1;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='interview_questions' AND column_name='question_text') THEN
            ALTER TABLE public.interview_questions ADD COLUMN question_text TEXT DEFAULT 'Sample question';
        END IF;
    END IF;

    -- ===============================
    -- 8. INTERVIEW_RESPONSES TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'interview_responses'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating interview_responses table...';
        CREATE TABLE public.interview_responses (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            question_id UUID,
            mock_interview_id UUID,
            response_text TEXT,
            audio_url TEXT, -- URL to audio recording
            response_duration INTEGER, -- Duration in seconds
            ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
            ai_feedback TEXT,
            key_points TEXT[],
            responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- ===============================
    -- 9. INTERVIEW_CHATS TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'interview_chats'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating interview_chats table...';
        CREATE TABLE public.interview_chats (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            mock_interview_id UUID,
            message_type TEXT CHECK (message_type IN ('question', 'response', 'feedback', 'system')) NOT NULL,
            sender TEXT CHECK (sender IN ('ai', 'user', 'system')) NOT NULL,
            content TEXT NOT NULL,
            message_order INTEGER NOT NULL,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- ===============================
    -- 10. INTERVIEW_ANALYTICS TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'interview_analytics'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating interview_analytics table...';
        CREATE TABLE public.interview_analytics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            mock_interview_id UUID,
            event_type TEXT NOT NULL, -- 'start', 'question_view', 'response_submit', 'complete', etc.
            event_data JSONB DEFAULT '{}',
            session_id TEXT,
            ip_address INET,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- ===============================
    -- 11. PERFORMANCE_METRICS TABLE
    -- ===============================
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'performance_metrics'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Creating performance_metrics table...';
        CREATE TABLE public.performance_metrics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            mock_interview_id UUID,
            metric_type TEXT NOT NULL, -- 'communication', 'technical', 'problem_solving', etc.
            score INTEGER CHECK (score BETWEEN 0 AND 100),
            details JSONB DEFAULT '{}',
            benchmark_comparison JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

END $$;

-- ==================================================
-- ADD FOREIGN KEY CONSTRAINTS (After all tables exist)
-- ==================================================

DO $$
BEGIN
    -- Add foreign key for mock_interviews -> resumes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mock_interviews_resume_id_fkey'
    ) THEN
        ALTER TABLE public.mock_interviews 
        ADD CONSTRAINT mock_interviews_resume_id_fkey 
        FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign key for mock_interviews -> job_descriptions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mock_interviews_job_description_id_fkey'
    ) THEN
        ALTER TABLE public.mock_interviews 
        ADD CONSTRAINT mock_interviews_job_description_id_fkey 
        FOREIGN KEY (job_description_id) REFERENCES public.job_descriptions(id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign key for interview_questions -> mock_interviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interview_questions_mock_interview_id_fkey'
    ) THEN
        ALTER TABLE public.interview_questions 
        ADD CONSTRAINT interview_questions_mock_interview_id_fkey 
        FOREIGN KEY (mock_interview_id) REFERENCES public.mock_interviews(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for interview_responses -> interview_questions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interview_responses_question_id_fkey'
    ) THEN
        ALTER TABLE public.interview_responses 
        ADD CONSTRAINT interview_responses_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES public.interview_questions(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for interview_responses -> mock_interviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interview_responses_mock_interview_id_fkey'
    ) THEN
        ALTER TABLE public.interview_responses 
        ADD CONSTRAINT interview_responses_mock_interview_id_fkey 
        FOREIGN KEY (mock_interview_id) REFERENCES public.mock_interviews(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for interview_chats -> mock_interviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interview_chats_mock_interview_id_fkey'
    ) THEN
        ALTER TABLE public.interview_chats 
        ADD CONSTRAINT interview_chats_mock_interview_id_fkey 
        FOREIGN KEY (mock_interview_id) REFERENCES public.mock_interviews(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for interview_analytics -> mock_interviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interview_analytics_mock_interview_id_fkey'
    ) THEN
        ALTER TABLE public.interview_analytics 
        ADD CONSTRAINT interview_analytics_mock_interview_id_fkey 
        FOREIGN KEY (mock_interview_id) REFERENCES public.mock_interviews(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for performance_metrics -> mock_interviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'performance_metrics_mock_interview_id_fkey'
    ) THEN
        ALTER TABLE public.performance_metrics 
        ADD CONSTRAINT performance_metrics_mock_interview_id_fkey 
        FOREIGN KEY (mock_interview_id) REFERENCES public.mock_interviews(id) ON DELETE CASCADE;
    END IF;
    
    RAISE NOTICE 'Foreign key constraints added successfully!';
END $$;

-- ==================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ==================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Resumes indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_active ON public.resumes(is_active);

-- Job descriptions indexes
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);

-- Mock interviews indexes
CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_id ON public.mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_status ON public.mock_interviews(status);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_created_at ON public.mock_interviews(created_at);

-- Interview questions indexes
CREATE INDEX IF NOT EXISTS idx_interview_questions_mock_interview_id ON public.interview_questions(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_type ON public.interview_questions(question_type);

-- Interview responses indexes
CREATE INDEX IF NOT EXISTS idx_interview_responses_question_id ON public.interview_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_mock_interview_id ON public.interview_responses(mock_interview_id);

-- Interview chats indexes
CREATE INDEX IF NOT EXISTS idx_interview_chats_mock_interview_id ON public.interview_chats(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_chats_message_order ON public.interview_chats(message_order);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_interview_analytics_user_id ON public.interview_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_analytics_mock_interview_id ON public.interview_analytics(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_analytics_event_type ON public.interview_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_interview_analytics_created_at ON public.interview_analytics(created_at);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_mock_interview_id ON public.performance_metrics(mock_interview_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_type ON public.performance_metrics(metric_type);

-- ==================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- CREATE RLS POLICIES (Permissive for development)
-- ==================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Users policies
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
CREATE POLICY "Users can manage their own data" ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- User profiles policies
DROP POLICY IF EXISTS "Users can manage their own user_profiles" ON public.user_profiles;
CREATE POLICY "Users can manage their own user_profiles" ON public.user_profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Resumes policies
DROP POLICY IF EXISTS "Users can manage their own resumes" ON public.resumes;
CREATE POLICY "Users can manage their own resumes" ON public.resumes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Job descriptions policies
DROP POLICY IF EXISTS "Users can manage their own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can manage their own job descriptions" ON public.job_descriptions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Mock interviews policies
DROP POLICY IF EXISTS "Users can manage their own interviews" ON public.mock_interviews;
CREATE POLICY "Users can manage their own interviews" ON public.mock_interviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Interview questions policies
DROP POLICY IF EXISTS "Users can manage interview questions" ON public.interview_questions;
CREATE POLICY "Users can manage interview questions" ON public.interview_questions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Interview responses policies
DROP POLICY IF EXISTS "Users can manage interview responses" ON public.interview_responses;
CREATE POLICY "Users can manage interview responses" ON public.interview_responses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Interview chats policies
DROP POLICY IF EXISTS "Users can manage interview chats" ON public.interview_chats;
CREATE POLICY "Users can manage interview chats" ON public.interview_chats FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Interview analytics policies
DROP POLICY IF EXISTS "Users can manage their own analytics" ON public.interview_analytics;
CREATE POLICY "Users can manage their own analytics" ON public.interview_analytics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Performance metrics policies
DROP POLICY IF EXISTS "Users can manage their own metrics" ON public.performance_metrics;
CREATE POLICY "Users can manage their own metrics" ON public.performance_metrics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==================================================
-- GRANT PERMISSIONS
-- ==================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ==================================================
-- VERIFICATION: List all created tables
-- ==================================================

SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'profiles', 'users', 'user_profiles', 'resumes', 'job_descriptions',
            'mock_interviews', 'interview_questions', 'interview_responses',
            'interview_chats', 'interview_analytics', 'performance_metrics'
        ) THEN '✅ Required'
        ELSE '⚠️ Extra'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ==================================================
-- FINAL SUCCESS MESSAGE
-- ==================================================

DO $$ 
BEGIN 
    RAISE NOTICE '🎉 Database setup completed successfully!';
    RAISE NOTICE '📋 All required tables have been checked and created/updated as needed.';
    RAISE NOTICE '🔒 Row Level Security (RLS) has been enabled with permissive policies for development.';
    RAISE NOTICE '🚀 Your Voice Vanguard Vault database is ready to use!';
END $$;