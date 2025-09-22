-- Fix missing trigger for profile creation
-- Run this in Supabase SQL Editor after the main migration

-- ===============================
-- CREATE THE MISSING TRIGGER
-- ===============================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger that calls handle_new_user when a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ===============================
-- VERIFY TRIGGER CREATION
-- ===============================

-- Check if trigger was created successfully
SELECT 
    t.tgname as trigger_name,
    c.relname as table_name,
    n.nspname as schema_name,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'on_auth_user_created';

-- ===============================
-- TEST MESSAGE
-- ===============================

SELECT 
    'Trigger fix applied successfully' as status,
    'Profile creation trigger is now active' as message;