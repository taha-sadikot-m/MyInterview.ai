# N8N Workflows for Voice Vanguard Vault Interview System

This directory contains the N8N workflow JSON files for the mock interview system. These workflows handle resume parsing, interview question generation, and response processing using AI.

## Workflows

### 1. Resume Parser Workflow (`resume-parser-workflow.json`)

**Purpose**: Processes uploaded resumes and extracts structured information using AI.

**Webhook Endpoint**: `/webhook/parse-resume`

**Input**: 
```json
{
  "resume_id": "uuid",
  "user_id": "uuid", 
  "file_url": "https://supabase-storage-url/resume.pdf"
}
```

**Process**:
1. Updates resume status to "processing"
2. Downloads PDF from Supabase Storage
3. Extracts text content using pdf-parse
4. Analyzes resume with OpenAI GPT-4
5. Validates and stores extracted data
6. Updates resume status to "completed" or "failed"

**Output**:
```json
{
  "success": true,
  "resume_id": "uuid",
  "message": "Resume parsed successfully"
}
```

### 2. Mock Interview Generator (`mock-interview-generator.json`)

**Purpose**: Creates personalized interview questions based on resume and job requirements.

**Webhook Endpoint**: `/webhook/mock-interview`

**Input**:
```json
{
  "user_id": "uuid",
  "resume_id": "uuid",
  "job_description_id": "uuid"
}
```

**Process**:
1. Creates interview record in database
2. Fetches resume and job description data
3. Prepares context for AI question generation
4. Generates questions using OpenAI GPT-4
5. Processes and validates question sets
6. Updates interview with generated questions

**Output**:
```json
{
  "success": true,
  "interview_id": "uuid",
  "questions_preview": [...],
  "total_questions": 6,
  "estimated_duration": 18
}
```

### 3. Interview Response Processor (`response-processor-workflow.json`)

**Purpose**: Processes individual interview responses and provides AI-powered feedback.

**Webhook Endpoint**: `/webhook/process-response`

**Input**:
```json
{
  "interview_id": "uuid",
  "question_id": "number",
  "question_text": "string",
  "response_text": "string",
  "audio_url": "string (optional)",
  "response_duration": "number (seconds)"
}
```

**Process**:
1. Saves response to interview_chats table
2. Fetches interview context and question details
3. Analyzes response using OpenAI GPT-4
4. Generates competency scores and feedback
5. Updates response with AI evaluation
6. Calculates interview progress and overall scores
7. Updates interview status if completed

**Output**:
```json
{
  "success": true,
  "interview_id": "uuid",
  "message": "Response processed successfully",
  "progress": {
    "completed_questions": 3,
    "total_questions": 6,
    "is_complete": false,
    "progress_percentage": 50
  },
  "scores": {
    "overall_score": 78,
    "competency_averages": {
      "communication": 85,
      "technical_knowledge": 70,
      "problem_solving": 80,
      "cultural_fit": 75
    }
  }
}
```

## Setup Instructions

### 1. Import Workflows to N8N

1. Open your N8N instance
2. Go to **Workflows** → **Import from File**
3. Upload each JSON file from this directory
4. Activate the workflows

### 2. Configure Credentials

Since the workflows use HTTP Request nodes instead of built-in connectors, you need to replace placeholder values in each workflow:

#### Replace Supabase Placeholders
In each workflow, find and replace:
- `YOUR_SUPABASE_PROJECT_ID` → Your actual Supabase project ID
- `YOUR_SUPABASE_ANON_KEY` → Your Supabase anonymous key  
- `YOUR_SUPABASE_SERVICE_ROLE_KEY` → Your Supabase service role key

#### Replace OpenAI Placeholder
In workflows with AI analysis, replace:
- `YOUR_OPENAI_API_KEY` → Your OpenAI API key

#### Example URLs after replacement:
```
https://abcdefghijklmnop.supabase.co/rest/v1/resumes
```

### 3. Update Environment Variables

Add these to your application's `.env` file:

```bash
# N8N Webhook URLs (replace with your actual N8N instance URLs)
VITE_N8N_RESUME_PARSER_URL=https://your-n8n-instance.com/webhook/parse-resume
VITE_N8N_MOCK_INTERVIEW_URL=https://your-n8n-instance.com/webhook/mock-interview
VITE_N8N_PROCESS_RESPONSE_URL=https://your-n8n-instance.com/webhook/process-response
VITE_N8N_AUTH_TOKEN=your_webhook_auth_token
```

### 4. Enable Required NPM Packages

In your N8N instance, ensure these packages are available:
- `pdf-parse` - for PDF text extraction
- Node.js built-in modules for JSON processing

## Testing the Workflows

### Test Resume Parser:
```bash
curl -X POST https://your-n8n-instance.com/webhook/parse-resume \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "resume_id": "test-resume-id",
    "user_id": "test-user-id",
    "file_url": "https://your-supabase-url/storage/v1/object/public/resumes/test.pdf"
  }'
```

### Test Mock Interview Generator:
```bash
curl -X POST https://your-n8n-instance.com/webhook/mock-interview \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "user_id": "test-user-id",
    "resume_id": "test-resume-id", 
    "job_description_id": "test-job-id"
  }'
```

## Workflow Dependencies

### Database Tables Required:
- `resumes` - stores resume files and parsed data
- `job_descriptions` - stores job requirements
- `mock_interviews` - stores interview sessions and questions
- `interview_chats` - stores question-answer pairs

### External Services:
- **Supabase**: Database and file storage
- **OpenAI**: GPT-4 for content analysis and generation
- **N8N**: Workflow orchestration

## Troubleshooting

### Common Issues:

1. **PDF Parsing Fails**
   - Ensure `pdf-parse` package is installed in N8N
   - Check file URL accessibility
   - Verify PDF file is not corrupted

2. **OpenAI API Errors**
   - Validate API key and quota
   - Check prompt length limits
   - Ensure model availability (gpt-4-turbo)

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check RLS policies
   - Validate table schemas

4. **Webhook Authentication**
   - Ensure auth token is correctly set
   - Check webhook URL accessibility
   - Verify CORS settings if applicable

## Monitoring and Logs

Monitor workflow execution in N8N:
- Check execution history for errors
- Review OpenAI token usage
- Monitor database operation success rates
- Track webhook response times

For production deployment, consider setting up:
- Error notifications
- Performance monitoring
- Backup workflows
- Rate limiting