# Interview Evaluation Workflow

This N8N workflow processes interview responses and generates comprehensive evaluations using AI.

## Webhook Endpoint
`POST /webhook/evaluate-interview`

## Input Format
```json
{
  "interviewId": "uuid",
  "userId": "uuid", 
  "companyName": "Company Name",
  "roleTitle": "Job Role",
  "questionsAndAnswers": [
    {
      "question": "Tell me about yourself",
      "answer": "I am a software developer...",
      "followUps": [
        {
          "question": "What's your biggest strength?",
          "answer": "My problem-solving ability..."
        }
      ]
    }
  ],
  "totalQuestions": 5,
  "questionsAnswered": 5
}
```

## Processing Steps

1. **Input Validation**: Validates required fields and structures data
2. **AI Evaluation**: Uses OpenAI GPT-4 to evaluate responses across 6 competencies
3. **Response Parsing**: Parses and validates the AI evaluation response
4. **Database Update**: Stores evaluation results in the mock_interviews table
5. **Response**: Returns evaluation results to the client

## Competency Scoring (0-10 scale)

- **Communication**: Clarity, articulation, structure, and engagement
- **StructuredThinkingSTAR**: Use of Situation, Task, Action, Result framework
- **TechnicalFundamentals**: Technical knowledge and understanding  
- **ProblemSolving**: Analytical approach and creative solutions
- **CultureOwnership**: Cultural fit and sense of responsibility
- **Coachability**: Openness to feedback and learning mindset

## Output Format
```json
{
  "success": true,
  "evaluation": {
    "overall_score": 7.5,
    "competency_scores": {
      "Communication": 8,
      "StructuredThinkingSTAR": 7,
      "TechnicalFundamentals": 7,
      "ProblemSolving": 8,
      "CultureOwnership": 7,
      "Coachability": 8
    },
    "strengths": [
      "Clear communication style",
      "Good problem-solving approach", 
      "Shows enthusiasm for the role"
    ],
    "improvements": [
      "Provide more specific examples",
      "Use STAR method consistently",
      "Include quantifiable results"
    ],
    "feedback_summary": "Overall strong performance...",
    "star_examples": [
      {
        "category": "Problem Solving",
        "before": "I solved the problem by working on it.",
        "after": "Situation: Our application had performance issues..."
      }
    ],
    "action_plan": [
      {
        "day": 1,
        "task": "Practice STAR method responses",
        "category": "Communication"
      }
    ],
    "detailed_feedback": [
      {
        "question": "Tell me about yourself",
        "answer_quality": 7,
        "feedback": "Good response but could be more structured",
        "suggestions": ["Use STAR method", "Include specific metrics"]
      }
    ],
    "evaluatedAt": "2025-01-XX...",
    "interviewId": "uuid",
    "userId": "uuid"
  }
}
```

## Error Handling

- Input validation errors return 400 status
- AI processing failures fall back to mock evaluation
- Database errors are logged and reported
- All errors return structured error responses

## Setup Instructions

1. Import the workflow JSON file into your N8N instance
2. Configure OpenAI credentials
3. Configure Supabase database connection
4. Set up webhook authentication if required
5. Test the workflow with sample data

## Testing

Use the test button in the application setup page to send sample interview data and verify the workflow is working correctly.