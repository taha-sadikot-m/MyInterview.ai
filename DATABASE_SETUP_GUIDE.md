# Voice Vanguard Vault - Database Tables Reference

## Complete List of Required Tables

### 1. **profiles** 
- **Purpose**: Main user profile table (extends Supabase auth.users)
- **Key Fields**: user_id, email, full_name, phone, college, verification fields, password reset fields
- **Special Features**: Email verification, password reset functionality

### 2. **users**
- **Purpose**: Base user table (may be handled by Supabase auth)
- **Key Fields**: id, email, full_name, avatar_url
- **Note**: This might be redundant if using Supabase auth.users

### 3. **user_profiles**
- **Purpose**: Extended user profile data
- **Key Fields**: user_id, phone, college, graduation_year, experience_level, target_companies, preferred_roles

### 4. **resumes**
- **Purpose**: Store uploaded resumes and parsed data
- **Key Fields**: user_id, file_name, file_url, file_base64, extracted_data, parsing_status
- **Special Features**: Base64 storage for OCR, parsing status tracking

### 5. **job_descriptions**
- **Purpose**: Custom job postings and requirements
- **Key Fields**: user_id, company_name, role_title, description, requirements, skills_required

### 6. **mock_interviews**
- **Purpose**: Interview session management
- **Key Fields**: user_id, company_name, role_title, status, overall_score, competency_scores, feedback
- **Special Features**: Tracks interview progress, scores, and feedback

### 7. **interview_questions**
- **Purpose**: Store interview questions
- **Key Fields**: mock_interview_id, question_text, question_type, competency, difficulty_level
- **Special Features**: AI-generated flag, follow-up questions

### 8. **interview_responses**
- **Purpose**: User responses to interview questions
- **Key Fields**: question_id, response_text, audio_url, ai_score, ai_feedback, key_points
- **Special Features**: Audio recording support, AI scoring

### 9. **interview_chats**
- **Purpose**: Chat/conversation logs during interviews
- **Key Fields**: mock_interview_id, message_type, sender, content, message_order
- **Special Features**: Maintains conversation flow and order

### 10. **interview_analytics**
- **Purpose**: Track user behavior and analytics
- **Key Fields**: user_id, mock_interview_id, event_type, event_data, session_id
- **Special Features**: Event tracking, session management

### 11. **performance_metrics**
- **Purpose**: Performance tracking and benchmarking
- **Key Fields**: user_id, mock_interview_id, metric_type, score, benchmark_comparison
- **Special Features**: Competency scoring, performance comparison

## How to Use the Setup Script

### Step 1: Run the Main Setup Script
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the content from `complete-database-setup.sql`
4. Run the script

### Step 2: Verify Tables Were Created
The script will automatically show you a verification query at the end listing all tables with their status.

### Step 3: What the Script Does
- ✅ **Checks existing tables** - Won't overwrite existing data
- ✅ **Creates missing tables** - Only creates what's needed
- ✅ **Adds missing columns** - Updates existing tables with new fields
- ✅ **Creates indexes** - For optimal performance
- ✅ **Enables RLS** - Row Level Security for data protection
- ✅ **Sets up policies** - Permissive policies for development
- ✅ **Grants permissions** - Proper access control

### Step 4: Check for Success
Look for these messages in the SQL output:
```
🎉 Database setup completed successfully!
📋 All required tables have been checked and created/updated as needed.
🔒 Row Level Security (RLS) has been enabled with permissive policies for development.
🚀 Your Voice Vanguard Vault database is ready to use!
```

## Key Features of This Setup

### 🔄 **Idempotent Script**
- Safe to run multiple times
- Won't delete existing data
- Only adds what's missing

### 🔒 **Security First**
- Row Level Security enabled
- Proper foreign key constraints
- Input validation with CHECK constraints

### ⚡ **Performance Optimized**
- Strategic indexes on frequently queried columns
- Proper data types for efficiency

### 🎯 **Production Ready**
- Handles all authentication flows
- Supports email verification
- Password reset functionality
- Analytics and performance tracking

## Table Relationships

```
profiles (main user data)
├── resumes (user's uploaded resumes)
├── job_descriptions (user's custom job posts)
└── mock_interviews (interview sessions)
    ├── interview_questions (questions for each interview)
    ├── interview_responses (user's answers)
    ├── interview_chats (conversation logs)
    ├── interview_analytics (behavior tracking)
    └── performance_metrics (scoring data)
```

## Next Steps After Setup

1. **Test the Database**: Use the provided test utilities in `src/utils/database-test.ts`
2. **Update TypeScript Types**: The types in `src/integrations/supabase/types.ts` should match
3. **Configure RLS Policies**: Adjust policies based on your security requirements
4. **Set up Storage**: Configure Supabase storage for resume files and audio recordings

## Troubleshooting

### If you get permission errors:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
```

### If foreign key constraints fail:
- Check that referenced tables exist first
- Ensure user_id fields match your auth system

### If RLS blocks operations:
- The script uses permissive policies for development
- Adjust policies in production for proper security

## Environment Variables Required

Make sure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```