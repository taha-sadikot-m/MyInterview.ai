# N8N Mock Interview Workflow

## Workflow Overview
This workflow conducts intelligent, dynamic mock interviews by generating personalized questions based on user's resume and job description, processes responses in real-time, and maintains conversation flow.

## Workflow Architecture

### Main Workflow: Interview Conductor
Handles the overall interview session management and coordination.

### Sub-Workflow: Question Generator
Generates dynamic questions based on context and user responses.

### Sub-Workflow: Response Analyzer
Analyzes user responses and provides real-time feedback.

## Main Workflow Steps

### 1. Start Interview Webhook
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Endpoint**: `/start-interview`
- **Expected Payload**:
```json
{
  "user_id": "uuid",
  "resume_id": "uuid",
  "job_description_id": "uuid",
  "company_name": "string",
  "role_title": "string",
  "interview_preferences": {
    "total_questions": 6,
    "focus_areas": ["technical", "behavioral", "situational"],
    "difficulty_level": "intermediate"
  }
}
```

### 2. Fetch User Data
- **Node Type**: Supabase (Multiple Queries)
- **Query 1 - Resume Data**:
```sql
SELECT * FROM resumes WHERE id = {{ $json.resume_id }} AND user_id = {{ $json.user_id }}
```
- **Query 2 - Job Description**:
```sql
SELECT * FROM job_descriptions WHERE id = {{ $json.job_description_id }} AND user_id = {{ $json.user_id }}
```

### 3. Create Interview Session
- **Node Type**: Supabase
- **Operation**: INSERT
- **Table**: mock_interviews
- **Data**:
```json
{
  "user_id": "{{ $json.user_id }}",
  "resume_id": "{{ $json.resume_id }}",
  "job_description_id": "{{ $json.job_description_id }}",
  "company_name": "{{ $json.company_name }}",
  "role_title": "{{ $json.role_title }}",
  "interview_type": "custom",
  "status": "in_progress",
  "total_questions": "{{ $json.interview_preferences.total_questions }}",
  "questions_answered": 0
}
```

### 4. Generate Interview Context
- **Node Type**: Code (JavaScript)
- **Purpose**: Prepare context for AI question generation
- **Code**:
```javascript
const resumeData = items[0].json.extracted_data;
const jobDescription = items[1].json.description;
const interviewId = items[2].json.id;

const context = {
  interview_id: interviewId,
  candidate_profile: {
    experience: resumeData.experience || [],
    skills: resumeData.skills || {},
    education: resumeData.education || [],
    projects: resumeData.projects || []
  },
  job_requirements: {
    description: jobDescription,
    required_skills: items[1].json.skills_required || [],
    experience_level: items[1].json.experience_level
  },
  interview_config: {
    total_questions: $('Webhook').first().json.interview_preferences.total_questions,
    focus_areas: $('Webhook').first().json.interview_preferences.focus_areas,
    current_question: 1,
    conversation_history: []
  }
};

return [{ json: context }];
```

### 5. WebSocket Connection Setup
- **Node Type**: Code (WebSocket)
- **Purpose**: Establish real-time connection with frontend
- **Code**:
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    
    if (data.type === 'interview_response') {
      // Process user response
      processUserResponse(data);
    }
  });
  
  // Send initial question
  ws.send(JSON.stringify({
    type: 'interview_question',
    question: generateFirstQuestion(context),
    question_number: 1
  }));
});
```

## Question Generator Sub-Workflow

### 1. Analyze Current Context
- **Node Type**: OpenAI
- **Model**: gpt-4-turbo
- **System Prompt**:
```
You are an expert interview conductor. Based on the candidate's resume, job description, and previous responses, generate the next most relevant interview question.

Guidelines:
1. Ask questions that match the job requirements
2. Build upon previous responses
3. Mix technical and behavioral questions
4. Ensure questions are specific to the candidate's background
5. Maintain appropriate difficulty progression

Context provided:
- Candidate's background and experience
- Job description and requirements
- Previous questions and responses
- Current interview progress

Return a JSON object with:
{
  "question": "The interview question",
  "question_type": "technical|behavioral|situational|company_specific",
  "category": "communication|problem_solving|leadership|technical_skills",
  "expected_duration": 120,
  "follow_up_hints": ["hint1", "hint2"],
  "evaluation_criteria": ["criteria1", "criteria2"]
}
```

### 2. Store Question in Database
- **Node Type**: Supabase
- **Operation**: INSERT
- **Table**: interview_questions
- **Data**:
```json
{
  "mock_interview_id": "{{ $json.interview_id }}",
  "question_number": "{{ $json.current_question }}",
  "question_text": "{{ $json.question }}",
  "question_type": "{{ $json.question_type }}",
  "question_category": "{{ $json.category }}",
  "ai_generated": true
}
```

### 3. Add to Chat History
- **Node Type**: Supabase
- **Operation**: INSERT
- **Table**: interview_chats
- **Data**:
```json
{
  "mock_interview_id": "{{ $json.interview_id }}",
  "message_type": "question",
  "sender": "ai",
  "content": "{{ $json.question }}",
  "message_order": "{{ $json.message_order }}",
  "metadata": {
    "question_type": "{{ $json.question_type }}",
    "category": "{{ $json.category }}",
    "expected_duration": "{{ $json.expected_duration }}"
  }
}
```

## Response Analyzer Sub-Workflow

### 1. Process User Response
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Endpoint**: `/process-response`
- **Expected Payload**:
```json
{
  "interview_id": "uuid",
  "question_id": "uuid",
  "response_text": "string",
  "audio_url": "string",
  "response_duration": 120
}
```

### 2. AI Response Analysis
- **Node Type**: OpenAI
- **Model**: gpt-4-turbo
- **System Prompt**:
```
You are an expert interview evaluator. Analyze the candidate's response and provide detailed feedback.

Evaluation Criteria:
1. Content Quality: Relevance, completeness, accuracy
2. Communication Skills: Clarity, structure, articulation
3. Technical Knowledge: Depth of understanding, practical application
4. Problem-Solving: Analytical thinking, approach to challenges
5. Behavioral Indicators: Leadership, teamwork, adaptability

Response Analysis:
- The candidate was asked: {{ $json.question_text }}
- The candidate responded: {{ $json.response_text }}
- Response duration: {{ $json.response_duration }} seconds
- Question type: {{ $json.question_type }}
- Job role: {{ $json.role_title }}

Provide analysis in JSON format:
{
  "score": 8.5,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "key_points": ["point1", "point2"],
  "follow_up_needed": true,
  "follow_up_question": "specific follow-up question",
  "detailed_feedback": "comprehensive feedback text",
  "competency_scores": {
    "communication": 8,
    "technical_knowledge": 7,
    "problem_solving": 9,
    "cultural_fit": 8
  }
}
```

### 3. Store Response and Analysis
- **Node Type**: Supabase
- **Operation**: INSERT
- **Table**: interview_responses
- **Data**:
```json
{
  "question_id": "{{ $json.question_id }}",
  "mock_interview_id": "{{ $json.interview_id }}",
  "response_text": "{{ $json.response_text }}",
  "audio_url": "{{ $json.audio_url }}",
  "response_duration": "{{ $json.response_duration }}",
  "ai_score": "{{ $json.score }}",
  "ai_feedback": "{{ $json.detailed_feedback }}",
  "key_points": "{{ JSON.stringify($json.key_points) }}"
}
```

### 4. Update Chat History
- **Node Type**: Supabase
- **Operation**: INSERT
- **Table**: interview_chats
- **Data**:
```json
{
  "mock_interview_id": "{{ $json.interview_id }}",
  "message_type": "response",
  "sender": "user",
  "content": "{{ $json.response_text }}",
  "message_order": "{{ $json.message_order }}",
  "metadata": {
    "duration": "{{ $json.response_duration }}",
    "score": "{{ $json.score }}",
    "audio_url": "{{ $json.audio_url }}"
  }
}
```

### 5. Decision Logic: Next Action
- **Node Type**: Code (JavaScript)
- **Purpose**: Determine next interview action
- **Code**:
```javascript
const currentQuestion = $json.current_question;
const totalQuestions = $json.total_questions;
const needsFollowUp = $json.follow_up_needed;
const overallProgress = $json.questions_answered / totalQuestions;

let nextAction;

if (needsFollowUp && currentQuestion <= totalQuestions) {
  nextAction = {
    type: 'follow_up',
    question: $json.follow_up_question,
    question_number: currentQuestion + 0.5 // Sub-question
  };
} else if (currentQuestion < totalQuestions) {
  nextAction = {
    type: 'next_question',
    question_number: currentQuestion + 1
  };
} else {
  nextAction = {
    type: 'complete_interview'
  };
}

return [{ json: { ...nextAction, interview_id: $json.interview_id } }];
```

## Interview Completion Workflow

### 1. Generate Final Assessment
- **Node Type**: OpenAI
- **Model**: gpt-4-turbo
- **System Prompt**:
```
Generate a comprehensive interview assessment based on all responses.

Provide a detailed analysis including:
1. Overall performance score (1-10)
2. Competency breakdown
3. Key strengths demonstrated
4. Areas for improvement
5. Specific recommendations
6. Hiring recommendation (Strong Hire/Hire/No Hire/Strong No Hire)
7. 5-day improvement action plan

Consider:
- Job requirements match
- Communication effectiveness
- Technical competency
- Problem-solving approach
- Cultural fit indicators
- Growth potential
```

### 2. Update Interview Record
- **Node Type**: Supabase
- **Operation**: UPDATE
- **Table**: mock_interviews
- **Data**:
```json
{
  "status": "completed",
  "completed_at": "{{ new Date().toISOString() }}",
  "overall_score": "{{ $json.overall_score }}",
  "competency_scores": "{{ JSON.stringify($json.competency_scores) }}",
  "strengths": "{{ JSON.stringify($json.strengths) }}",
  "improvements": "{{ JSON.stringify($json.improvements) }}",
  "feedback_summary": "{{ $json.feedback_summary }}",
  "questions_answered": "{{ $json.total_questions }}"
}
```

### 3. Send Final Feedback
- **Node Type**: WebSocket
- **Purpose**: Send completion notification and results
- **Message**:
```json
{
  "type": "interview_complete",
  "results": {
    "overall_score": "{{ $json.overall_score }}",
    "competency_scores": "{{ $json.competency_scores }}",
    "strengths": "{{ $json.strengths }}",
    "improvements": "{{ $json.improvements }}",
    "action_plan": "{{ $json.action_plan }}",
    "detailed_report": "{{ $json.detailed_report }}"
  }
}
```

## Real-Time Features

### Live Feedback
- Provide instant feedback after each response
- Show real-time competency scoring
- Display progress indicators

### Adaptive Questioning
- Adjust difficulty based on performance
- Skip redundant questions if competency is clear
- Deep dive into weak areas with follow-ups

### Dynamic Pacing
- Monitor response times
- Adjust question complexity based on user stress indicators
- Provide encouragement and guidance

## Error Handling & Recovery

### Connection Issues
- Implement reconnection logic
- Save state every 30 seconds
- Resume from last saved state

### AI Service Failures
- Fallback to pre-defined questions
- Queue responses for later analysis
- Graceful degradation of features

### Database Failures
- Cache responses locally
- Batch upload when connection restored
- Maintain interview continuity

## Configuration

### Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
WEBSOCKET_PORT=8080
REDIS_URL=your_redis_url (for session management)
```

### Interview Parameters
```json
{
  "default_questions": 6,
  "max_follow_ups": 2,
  "response_timeout": 300,
  "max_interview_duration": 3600,
  "competency_weights": {
    "communication": 0.25,
    "technical": 0.35,
    "problem_solving": 0.25,
    "cultural_fit": 0.15
  }
}
```

## Monitoring & Analytics

### Real-Time Metrics
- Active interview sessions
- Average response times
- Completion rates
- User satisfaction scores

### Performance Analytics
- Question effectiveness tracking
- AI accuracy monitoring
- User engagement patterns
- Interview outcome correlations

### Quality Assurance
- Random interview review
- AI feedback validation
- Continuous model improvement
- User feedback integration

This workflow creates a sophisticated, human-like interview experience that adapts to each candidate's unique background and provides valuable, actionable feedback for career development.