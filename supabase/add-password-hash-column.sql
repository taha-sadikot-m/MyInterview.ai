-- Add missing password_hash column to existing profiles table
-- This is a simple column addition to support custom authentication

DO $$
BEGIN
    -- Add password_hash column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='profiles' AND column_name='password_hash') THEN
        ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;
        
        -- Add index for performance
        CREATE INDEX IF NOT EXISTS idx_profiles_password_hash 
        ON public.profiles USING btree (password_hash) TABLESPACE pg_default;
        
        RAISE NOTICE 'Added password_hash column to profiles table';
    ELSE
        RAISE NOTICE 'password_hash column already exists in profiles table';
    END IF;
END $$;