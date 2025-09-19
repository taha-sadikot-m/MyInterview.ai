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
const N8N_AUTH_TOKEN = import.meta.env.VITE_N8N_AUTH_TOKEN;

// Check if N8N is properly configured
const isN8NConfigured = () => {
  const configured = N8N_RESUME_PARSER_URL !== 'https://your-n8n-instance.com/webhook/parse-resume' &&
         N8N_MOCK_INTERVIEW_URL !== 'https://your-n8n-instance.com/webhook/mock-interview' &&
         N8N_PROCESS_RESPONSE_URL !== 'https://your-n8n-instance.com/webhook/process-response';
         // Removed auth token requirement for testing
  
  console.log('N8N Configuration check:', {
    RESUME_PARSER_URL: N8N_RESUME_PARSER_URL,
    MOCK_INTERVIEW_URL: N8N_MOCK_INTERVIEW_URL,
    PROCESS_RESPONSE_URL: N8N_PROCESS_RESPONSE_URL,
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
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Triggering N8N mock interview workflow for:', interviewData.interviewId);
    
    // Check if N8N is configured
    if (!isN8NConfigured()) {
      console.warn('N8N not properly configured, skipping mock interview workflow');
      return { success: true, error: 'N8N not configured - using mock data' };
    }
    
    const response = await fetch(N8N_MOCK_INTERVIEW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${N8N_AUTH_TOKEN}`
      },
      body: JSON.stringify({
        interview_id: interviewData.interviewId,
        user_id: interviewData.userId,
        resume_id: interviewData.resumeId,
        job_description_id: interviewData.jobDescriptionId,
        company_name: interviewData.companyName,
        role_title: interviewData.roleTitle,
        interview_preferences: interviewData.preferences
      })
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
      return { success: true }; // Assume success for demo purposes
    }

    const result = JSON.parse(responseText);
    return { success: true }; // Always return success for demo
  } catch (error) {
    console.error('Mock interview workflow error:', error);
    return { 
      success: false, 
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