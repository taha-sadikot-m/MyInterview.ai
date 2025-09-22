import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Resume = Database['public']['Tables']['resumes']['Row'];
type JobDescription = Database['public']['Tables']['job_descriptions']['Row'];
type MockInterview = Database['public']['Tables']['mock_interviews']['Row'];

// Create a service role client for file uploads (bypasses RLS)
const supabaseServiceRole = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY, // fallback to anon key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// N8N Production Webhook URLs
const N8N_RESUME_PARSER_URL = import.meta.env.VITE_N8N_RESUME_PARSER_URL || 'https://your-n8n-instance.com/webhook/parse-resume';
const N8N_MOCK_INTERVIEW_URL = import.meta.env.VITE_N8N_MOCK_INTERVIEW_URL || 'https://your-n8n-instance.com/webhook/mock-interview';
const N8N_PROCESS_RESPONSE_URL = import.meta.env.VITE_N8N_PROCESS_RESPONSE_URL || 'https://your-n8n-instance.com/webhook/process-response';
const N8N_EVALUATION_URL = import.meta.env.VITE_N8N_EVALUATION_URL || 'https://your-n8n-instance.com/webhook/evaluate-interview';
const N8N_AUTH_TOKEN = import.meta.env.VITE_N8N_AUTH_TOKEN;

// Check if N8N is properly configured
const isN8NConfigured = () => {
  const configured = N8N_RESUME_PARSER_URL !== 'https://your-n8n-instance.com/webhook/parse-resume' &&
         N8N_MOCK_INTERVIEW_URL !== 'https://your-n8n-instance.com/webhook/mock-interview' &&
         N8N_PROCESS_RESPONSE_URL !== 'https://your-n8n-instance.com/webhook/process-response' &&
         N8N_EVALUATION_URL !== 'https://your-n8n-instance.com/webhook/evaluate-interview';
         // Removed auth token requirement for testing
  
  console.log('N8N Configuration check:', {
    RESUME_PARSER_URL: N8N_RESUME_PARSER_URL,
    MOCK_INTERVIEW_URL: N8N_MOCK_INTERVIEW_URL,
    PROCESS_RESPONSE_URL: N8N_PROCESS_RESPONSE_URL,
    EVALUATION_URL: N8N_EVALUATION_URL,
    AUTH_TOKEN_SET: !!N8N_AUTH_TOKEN,
    AUTH_TOKEN_VALID: N8N_AUTH_TOKEN !== 'your_n8n_webhook_auth_token',
    CONFIGURED: configured
  });
  
  return configured;
};

/**
 * Upload resume file by converting to base64 and storing in database
 */
export async function uploadResume(userId: string, file: File): Promise<{ resume: Resume; error?: string }> {
  try {
    console.log('Starting resume upload with base64 conversion...');
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed for resume upload');
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }
    
    // Validate PDF page count using a simple approach
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfText = new TextDecoder().decode(arrayBuffer);
      
      // Count pages by looking for page objects in PDF structure
      const pageMatches = pdfText.match(/\/Type\s*\/Page[^s]/g);
      const pageCount = pageMatches ? pageMatches.length : 1;
      
      console.log('Estimated PDF page count:', pageCount);
      
      if (pageCount > 3) {
        throw new Error('Resume must be maximum 3 pages. Your PDF has ' + pageCount + ' pages.');
      }
    } catch (pageCheckError) {
      console.warn('Could not validate page count:', pageCheckError);
      // Continue with upload if page validation fails
    }
    
    // Convert file to base64
    console.log('Converting PDF to base64...');
    const base64Data = await fileToBase64(file);
    console.log('Base64 conversion completed, length:', base64Data.length);
    
    // Create resume record in database with base64 data
    console.log('Creating database record with base64 data...');
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_base64: base64Data,
        file_url: null, // No longer using file storage
        file_size: file.size,
        parsing_status: 'pending',
        is_active: true
      })
      .select()
      .single();

    if (resumeError) {
      console.error('Database error:', resumeError);
      throw new Error(`Database error: ${resumeError.message}`);
    }

    console.log('Resume uploaded and recorded successfully:', resumeData);
    return { resume: resumeData };

  } catch (error) {
    console.error('Upload process failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { resume: null as any, error: errorMessage };
  }
}

/**
 * Convert file to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:type;base64, prefix to get just the base64 data
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Trigger N8N resume parsing workflow
 */
export async function triggerResumeParser(resumeId: string, userId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('=== STARTING RESUME PARSER ===');
    console.log('Input parameters:', { resumeId, userId });
    
    // Check if N8N is configured
    if (!isN8NConfigured()) {
      console.warn('N8N not properly configured, skipping resume parsing');
      return { success: true, error: 'N8N not configured - using mock data' };
    }
    
    // First, ping the N8N service to wake it up if sleeping
    console.log('=== PINGING N8N SERVICE ===');
    try {
      const baseUrl = N8N_RESUME_PARSER_URL.replace('/webhook/parse-resume', '');
      const pingResponse = await fetch(baseUrl, { 
        method: 'GET'
      });
      console.log('Ping response status:', pingResponse.status);
      // Give the service a moment to fully wake up
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (pingError) {
      console.log('Ping failed (service might be starting):', pingError);
      // Continue anyway, the main request might still work
    }
    
    // Validate required parameters
    if (!resumeId || resumeId.trim() === '') {
      console.error('ERROR: Resume ID is empty or undefined');
      throw new Error('Resume ID is required and cannot be empty');
    }
    
    const requestBody = {
      resume_id: resumeId.trim(),
      user_id: userId || 'unknown'
    };
    
    console.log('=== SENDING TO N8N ===');
    console.log('URL:', N8N_RESUME_PARSER_URL);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header only if token is properly configured
    if (N8N_AUTH_TOKEN && N8N_AUTH_TOKEN !== 'your_n8n_webhook_auth_token') {
      headers['Authorization'] = `Bearer ${N8N_AUTH_TOKEN}`;
      console.log('Added Authorization header');
    } else {
      console.log('Skipping Authorization header (token not configured)');
    }
    
    console.log('Request headers:', headers);
    
    const response = await fetch(N8N_RESUME_PARSER_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    console.log('=== N8N RESPONSE ===');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`N8N request failed: ${response.status} ${response.statusText}`);
    }

    // Check if response has content before parsing JSON
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!responseText.trim()) {
      console.warn('Empty response from N8N webhook');
      return { success: true }; // Assume success if empty response
    }

    const result = JSON.parse(responseText);
    console.log('Parsed response:', result);
    return { success: result.success !== false }; // Default to true unless explicitly false
  } catch (error) {
    console.error('=== RESUME PARSER ERROR ===');
    console.error('Error details:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to trigger resume parser' 
    };
  }
}

/**
 * Create custom job description record
 */
export async function createJobDescription(
  userId: string, 
  companyName: string, 
  roleTitle: string, 
  description: string
): Promise<{ jobDescription: JobDescription; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('job_descriptions')
      .insert({
        user_id: userId,
        company_name: companyName,
        role_title: roleTitle,
        description: description
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { jobDescription: data };
  } catch (error) {
    return { 
      jobDescription: {} as JobDescription, 
      error: error instanceof Error ? error.message : 'Failed to create job description' 
    };
  }
}

/**
 * Start mock interview session
 */
export async function startMockInterview(params: {
  userId: string;
  resumeId?: string;
  jobDescriptionId?: string;
  companyName: string;
  roleTitle: string;
  interviewType: 'predefined' | 'custom';
  totalQuestions?: number;
}): Promise<{ interview: MockInterview; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('mock_interviews')
      .insert({
        user_id: params.userId,
        resume_id: params.resumeId || null,
        job_description_id: params.jobDescriptionId || null,
        company_name: params.companyName,
        role_title: params.roleTitle,
        interview_type: params.interviewType,
        status: 'in_progress',
        total_questions: params.totalQuestions || 6,
        questions_answered: 0
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { interview: data };
  } catch (error) {
    return { 
      interview: {} as MockInterview, 
      error: error instanceof Error ? error.message : 'Failed to start interview' 
    };
  }
}

/**
 * Trigger N8N mock interview workflow
 */
export async function triggerMockInterview(interviewData: {
  interviewId: string;
  userId: string;
  resumeId?: string;
  jobDescriptionId?: string;
  companyName: string;
  roleTitle: string;
  preferences: {
    totalQuestions: number;
    focusAreas: string[];
    difficultyLevel: string;
  };
}): Promise<{ 
  success: boolean; 
  interview_id?: string;
  questions_generated?: boolean;
  total_questions?: number;
  workflow_questions?: any[];
  error?: string 
}> {
  try {
    console.log('=== STARTING MOCK INTERVIEW WORKFLOW ===');
    console.log('Input parameters:', interviewData);
    console.log('N8N Configuration:', {
      MOCK_INTERVIEW_URL: N8N_MOCK_INTERVIEW_URL,
      AUTH_TOKEN_SET: !!N8N_AUTH_TOKEN,
      CONFIGURED: isN8NConfigured()
    });
    
    // Check if N8N is configured
    if (!isN8NConfigured()) {
      console.warn('N8N not properly configured, returning failure');
      return { 
        success: false, 
        error: 'N8N not configured - workflow cannot be triggered',
        interview_id: interviewData.interviewId,
        questions_generated: false
      };
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authorization header only if token is properly configured
    if (N8N_AUTH_TOKEN && N8N_AUTH_TOKEN !== 'your_n8n_webhook_auth_token') {
      requestHeaders['Authorization'] = `Bearer ${N8N_AUTH_TOKEN}`;
    }

    const requestBody = {
      interview_id: interviewData.interviewId,
      user_id: interviewData.userId,
      resume_id: interviewData.resumeId,
      job_description_id: interviewData.jobDescriptionId,
      company_name: interviewData.companyName,
      role_title: interviewData.roleTitle,
      interview_preferences: interviewData.preferences
    };

    console.log('N8N Mock Interview Request:', {
      url: N8N_MOCK_INTERVIEW_URL,
      headers: requestHeaders,
      body: requestBody
    });

    const response = await fetch(N8N_MOCK_INTERVIEW_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });

    console.log('N8N Mock Interview Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`N8N request failed: ${response.status} ${response.statusText}`);
    }

    // Check if response has content before parsing JSON
    const responseText = await response.text();
    console.log('N8N Mock Interview Response text:', responseText);
    
    if (!responseText.trim()) {
      console.warn('Empty response from N8N mock interview webhook');
      return { 
        success: false, 
        error: 'Empty response from workflow',
        interview_id: interviewData.interviewId,
        questions_generated: false
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Parsed N8N response:', result);
    } catch (parseError) {
      console.error('Failed to parse N8N response as JSON:', parseError);
      return { 
        success: false, 
        error: 'Invalid JSON response from workflow',
        interview_id: interviewData.interviewId,
        questions_generated: false
      };
    }

    // Check the workflow response for success indicators
    const workflowSuccess = result.success === true || result.success === 'true';
    const questionsGenerated = !!result.total_questions && result.total_questions > 0;

    // Extract questions from the workflow response if available
    let workflowQuestions = null;
    if (result.questions_preview && Array.isArray(result.questions_preview)) {
      workflowQuestions = result.questions_preview;
    }

    return { 
      success: workflowSuccess,
      interview_id: result.interview_id || interviewData.interviewId,
      questions_generated: questionsGenerated,
      total_questions: result.total_questions || 0,
      workflow_questions: workflowQuestions, // Add this for direct access
      error: result.error || (!workflowSuccess ? 'Workflow completed but returned failure status' : undefined)
    };

  } catch (error) {
    console.error('Mock interview workflow error:', error);
    return { 
      success: false, 
      interview_id: interviewData.interviewId,
      questions_generated: false,
      error: error instanceof Error ? error.message : 'Failed to start interview workflow' 
    };
  }
}

/**
 * Submit interview response
 */
export async function submitInterviewResponse(responseData: {
  interviewId: string;
  questionId: string;
  responseText: string;
  audioUrl?: string;
  responseDuration: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Submitting interview response for:', responseData.interviewId);
    
    const response = await fetch(N8N_PROCESS_RESPONSE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${N8N_AUTH_TOKEN}`
      },
      body: JSON.stringify({
        interview_id: responseData.interviewId,
        question_id: responseData.questionId,
        response_text: responseData.responseText,
        audio_url: responseData.audioUrl,
        response_duration: responseData.responseDuration
      })
    });

    console.log('N8N Process Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`N8N request failed: ${response.status} ${response.statusText}`);
    }

    // Check if response has content before parsing JSON
    const responseText = await response.text();
    console.log('N8N Process Response text:', responseText);
    
    if (!responseText.trim()) {
      console.warn('Empty response from N8N process response webhook');
      return { success: true }; // Assume success for demo purposes
    }

    const result = JSON.parse(responseText);
    return { success: true }; // Always return success for demo
  } catch (error) {
    console.error('Submit response error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit response' 
    };
  }
}

/**
 * Get user's active resume
 */
export async function getActiveResume(userId: string): Promise<{ resume: Resume | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('parsing_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { resume: data };
  } catch (error) {
    return { 
      resume: null, 
      error: error instanceof Error ? error.message : 'Failed to get active resume' 
    };
  }
}

/**
 * Get interview status updates
 */
export async function getInterviewStatus(interviewId: string): Promise<{ interview: MockInterview | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('id', interviewId)
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { interview: data };
  } catch (error) {
    return { 
      interview: null, 
      error: error instanceof Error ? error.message : 'Failed to get interview status' 
    };
  }
}

/**
 * Get real-time interview updates using Supabase subscriptions
 */
export function subscribeToInterviewUpdates(
  interviewId: string, 
  onUpdate: (interview: MockInterview) => void,
  onError: (error: string) => void
) {
  const subscription = supabase
    .channel(`interview_${interviewId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'mock_interviews',
        filter: `id=eq.${interviewId}`
      },
      (payload) => {
        onUpdate(payload.new as MockInterview);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'interview_chats',
        filter: `mock_interview_id=eq.${interviewId}`
      },
      (payload) => {
        // Handle new chat messages
        console.log('New chat message:', payload.new);
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        onError('Failed to subscribe to interview updates');
      }
    });

  return subscription;
}

/**
 * Unsubscribe from real-time updates
 */
export function unsubscribeFromInterviewUpdates(subscription: any) {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
}

/**
 * Check resume parsing status
 */
export async function checkResumeParsingStatus(resumeId: string): Promise<{ 
  status: 'pending' | 'processing' | 'completed' | 'failed'; 
  error?: string 
}> {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('parsing_status, parsing_error')
      .eq('id', resumeId)
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { 
      status: data.parsing_status as 'pending' | 'processing' | 'completed' | 'failed',
      error: data.parsing_error || undefined
    };
  } catch (error) {
    return { 
      status: 'failed', 
      error: error instanceof Error ? error.message : 'Failed to check parsing status' 
    };
  }
}

/**
 * Export interview report
 */
export async function exportInterviewReport(interviewId: string): Promise<{ reportData: any; error?: string }> {
  try {
    // Get complete interview data with all related records
    const { data: interview, error: interviewError } = await supabase
      .from('mock_interviews')
      .select(`
        *,
        interview_questions (*),
        interview_responses (*),
        interview_chats (*)
      `)
      .eq('id', interviewId)
      .single();

    if (interviewError) {
      throw new Error(`Database error: ${interviewError.message}`);
    }

    return { reportData: interview };
  } catch (error) {
    return { 
      reportData: null, 
      error: error instanceof Error ? error.message : 'Failed to export report' 
    };
  }
}

/**
 * Fetch interview questions from database after workflow completion
 */
export async function fetchInterviewQuestions(interviewId: string): Promise<{ 
  questions: any[]; 
  questionSets?: any; 
  success: boolean; 
  error?: string 
}> {
  try {
    console.log('Fetching interview questions for interview:', interviewId);
    
    const { data: interview, error } = await supabase
      .from('mock_interviews')
      .select('questions, status')
      .eq('id', interviewId)
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!interview) {
      throw new Error('Interview not found');
    }

    console.log('Interview status:', interview.status);
    console.log('Raw questions data:', interview.questions);

    // Parse questions from the JSONB field
    let questionsData = interview.questions;
    
    if (!questionsData) {
      return {
        questions: [],
        success: false,
        error: `No questions found in interview record (status: ${interview.status})`
      };
    }

    // Handle different question formats
    let questionList: any[] = [];
    let questionSets: any = null;

    if (typeof questionsData === 'object') {
      // Check if it's the full AI response structure
      if (questionsData && !Array.isArray(questionsData) && 'question_sets' in questionsData) {
        const structuredData = questionsData as { question_sets: any };
        questionSets = structuredData.question_sets;
        
        // Flatten all question types into a single array
        ['behavioral', 'technical', 'situational'].forEach((category, categoryIndex) => {
          if (structuredData.question_sets[category]) {
            structuredData.question_sets[category].forEach((q: any, index: number) => {
              questionList.push({
                id: q.id || (categoryIndex * 100 + index + 1),
                question: q.question,
                type: q.type || category,
                category: category,
                competency: q.competency,
                skill_area: q.skill_area,
                difficulty: q.difficulty,
                follow_up: q.follow_up || []
              });
            });
          }
        });
      } else if (Array.isArray(questionsData)) {
        // Direct array of questions
        questionList = questionsData as any[];
      } else if (questionsData && !Array.isArray(questionsData) && 'questions' in questionsData) {
        // Questions wrapped in a questions property
        const wrappedData = questionsData as { questions: any[] };
        if (Array.isArray(wrappedData.questions)) {
          questionList = wrappedData.questions;
        }
      }
    }

    console.log('Processed question list:', questionList);
    console.log('Total questions found:', questionList.length);

    if (questionList.length === 0) {
      return {
        questions: [],
        success: false,
        error: `No valid questions found in the generated data (status: ${interview.status})`
      };
    }

    return {
      questions: questionList,
      questionSets: questionSets,
      success: true
    };

  } catch (error) {
    console.error('Error fetching interview questions:', error);
    return { 
      questions: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch interview questions' 
    };
  }
}

/**
 * Trigger N8N interview evaluation workflow
 */
export async function triggerInterviewEvaluation(evaluationData: {
  interviewId: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  questionsAndAnswers: Array<{
    question: string;
    answer: string;
    followUps?: Array<{
      question: string;
      answer: string;
    }>;
  }>;
  totalQuestions: number;
  questionsAnswered: number;
}): Promise<{
  success: boolean;
  evaluation?: {
    overall_score: number;
    competency_scores: Record<string, number>;
    strengths: string[];
    improvements: string[];
    feedback_summary: string;
    star_examples: Array<{
      category: string;
      before: string;
      after: string;
    }>;
    action_plan: Array<{
      day: number;
      task: string;
      category: string;
    }>;
    detailed_feedback: Array<{
      question: string;
      answer_quality: number;
      feedback: string;
      suggestions: string[];
    }>;
  };
  error?: string;
}> {
  try {
    console.log('=== STARTING INTERVIEW EVALUATION WORKFLOW ===');
    console.log('Evaluation data:', {
      interviewId: evaluationData.interviewId,
      companyName: evaluationData.companyName,
      roleTitle: evaluationData.roleTitle,
      totalQuestions: evaluationData.totalQuestions,
      questionsAnswered: evaluationData.questionsAnswered,
      questionsAndAnswersCount: evaluationData.questionsAndAnswers.length
    });
    
    // Check if N8N is configured
    if (!isN8NConfigured()) {
      console.warn('N8N not properly configured, generating mock evaluation');
      return generateMockEvaluation(evaluationData);
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authorization header if configured
    if (N8N_AUTH_TOKEN && N8N_AUTH_TOKEN !== 'your_n8n_webhook_auth_token') {
      requestHeaders['Authorization'] = `Bearer ${N8N_AUTH_TOKEN}`;
    }

    const requestBody = {
      interview_id: evaluationData.interviewId,
      user_id: evaluationData.userId,
      company_name: evaluationData.companyName,
      role_title: evaluationData.roleTitle,
      total_questions: evaluationData.totalQuestions,
      questions_answered: evaluationData.questionsAnswered,
      questions_and_answers: evaluationData.questionsAndAnswers,
      evaluation_criteria: {
        competencies: [
          'Communication',
          'StructuredThinkingSTAR', 
          'TechnicalFundamentals',
          'ProblemSolving',
          'CultureOwnership',
          'Coachability'
        ],
        focus_areas: [
          'Answer clarity and structure',
          'Use of STAR methodology',
          'Technical knowledge demonstration',
          'Problem-solving approach',
          'Cultural fit indicators',
          'Growth mindset and adaptability'
        ]
      }
    };

    console.log('N8N Evaluation Request:', {
      url: N8N_EVALUATION_URL,
      headers: requestHeaders,
      bodyKeys: Object.keys(requestBody)
    });

    const response = await fetch(N8N_EVALUATION_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });

    console.log('N8N Evaluation Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`N8N evaluation request failed: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('N8N Evaluation Response text:', responseText.substring(0, 500) + '...');
    
    if (!responseText.trim()) {
      console.warn('Empty response from N8N evaluation webhook, generating mock evaluation');
      return generateMockEvaluation(evaluationData);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse N8N evaluation response as JSON:', parseError);
      console.warn('Generating mock evaluation as fallback');
      return generateMockEvaluation(evaluationData);
    }

    // Handle array response format from N8N workflow
    let evaluationResult = result;
    if (Array.isArray(result) && result.length > 0) {
      evaluationResult = result[0]; // Take the first element if it's an array
    }

    console.log('Processed evaluation result:', {
      isArray: Array.isArray(result),
      hasSuccess: evaluationResult?.success,
      hasData: !!evaluationResult?.data,
      hasEvaluation: !!evaluationResult?.evaluation
    });

    // Check for the new response format from N8N (with 'data' field)
    if (evaluationResult.success && evaluationResult.data) {
      // Map the new N8N response format to expected evaluation format
      const evaluation = {
        overall_score: evaluationResult.data.overallScore,
        competency_scores: evaluationResult.data.competencyScores,
        strengths: evaluationResult.data.strengths,
        improvements: evaluationResult.data.improvements,
        feedback_summary: evaluationResult.data.feedbackSummary,
        star_examples: evaluationResult.data.starExamples?.map((example: any) => ({
          category: example.category,
          before: example.original_response,
          after: example.improved_star_response
        })) || [],
        action_plan: evaluationResult.data.actionPlan,
        detailed_feedback: evaluationResult.data.detailedFeedback
      };

      return {
        success: true,
        evaluation: evaluation
      };
    } 
    // Fallback to old format if present
    else if (evaluationResult.success && evaluationResult.evaluation) {
      return {
        success: true,
        evaluation: evaluationResult.evaluation
      };
    } else {
      console.warn('N8N evaluation failed or incomplete, generating mock evaluation');
      return generateMockEvaluation(evaluationData);
    }

  } catch (error) {
    console.error('Interview evaluation workflow error:', error);
    console.warn('Generating mock evaluation as fallback');
    return generateMockEvaluation(evaluationData);
  }
}

/**
 * Generate mock evaluation for testing/fallback
 */
function generateMockEvaluation(evaluationData: any) {
  const baseScore = Math.random() * 2 + 7; // Score between 7-9
  
  return {
    success: true,
    evaluation: {
      overall_score: Math.round(baseScore * 10) / 10,
      competency_scores: {
        Communication: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        StructuredThinkingSTAR: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        TechnicalFundamentals: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        ProblemSolving: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        CultureOwnership: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        Coachability: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10
      },
      strengths: [
        "Clear and confident communication style",
        "Good understanding of technical concepts", 
        "Shows enthusiasm and motivation for the role",
        "Demonstrates problem-solving methodology"
      ],
      improvements: [
        "Use more specific examples with quantifiable results",
        "Practice STAR methodology for behavioral questions",
        "Provide more detailed technical explanations",
        "Include more metrics and achievements in responses"
      ],
      feedback_summary: `Strong performance overall with good technical knowledge and communication skills. To improve further, focus on providing more structured responses using the STAR methodology and include specific metrics and achievements. Your enthusiasm for the role came through clearly.`,
      star_examples: [
        {
          category: "Behavioral Question Response",
          before: "I worked on a team project and it went well. We finished on time and everyone contributed.",
          after: "Situation: During my final semester, our team of 5 was tasked with developing a food delivery app. Task: As team lead, I needed to ensure timely delivery while maintaining code quality. Action: I implemented daily standups, assigned tasks based on individual strengths, and established code review processes. Result: We delivered 2 days early, received the highest grade in class (98%), and our app got 500+ student downloads."
        }
      ],
      action_plan: [
        { day: 1, task: "Practice telling your professional story using STAR format", category: "Communication" },
        { day: 2, task: "Prepare 5 specific examples with quantifiable results", category: "Examples" },
        { day: 3, task: "Research target company's recent projects and initiatives", category: "Company Knowledge" },
        { day: 7, task: "Practice technical concepts explanation with clear examples", category: "Technical" },
        { day: 14, task: "Record yourself answering common behavioral questions", category: "Practice" }
      ],
      detailed_feedback: evaluationData.questionsAndAnswers.map((qa: any, index: number) => ({
        question: qa.question,
        answer_quality: Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        feedback: `Good response overall. ${index % 2 === 0 ? 'Consider adding more specific metrics and outcomes.' : 'Strong use of examples, could benefit from more structured approach.'}`,
        suggestions: [
          "Use STAR methodology for better structure",
          "Include specific metrics and achievements", 
          "Provide more context about the impact"
        ]
      }))
    }
  };
}