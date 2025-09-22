// Database connectivity test utility
import { supabase } from '@/integrations/supabase/client';

export async function testDatabaseConnection() {
  try {
    console.log('[DB Test] Testing database connection...');
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('mock_interviews')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('[DB Test] Database connection failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('[DB Test] Database connection successful');
    return { success: true, data };
    
  } catch (error) {
    console.error('[DB Test] Connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testTableStructure() {
  try {
    console.log('[DB Test] Testing table structure...');
    
    // Test mock_interviews table
    const { data: interviewData, error: interviewError } = await supabase
      .from('mock_interviews')
      .select('*')
      .limit(1);
      
    if (interviewError) {
      console.error('[DB Test] mock_interviews table error:', interviewError);
    } else {
      console.log('[DB Test] mock_interviews table accessible');
    }
    
    // Test interview_questions table structure
    const { data: questionsData, error: questionsError } = await supabase
      .from('interview_questions')
      .select('*')
      .limit(1);
      
    if (questionsError) {
      console.error('[DB Test] interview_questions table error:', questionsError);
    } else {
      console.log('[DB Test] interview_questions table accessible');
      if (questionsData && questionsData.length > 0) {
        console.log('[DB Test] interview_questions columns:', Object.keys(questionsData[0]));
      }
    }
    
    // Test interview_responses table
    const { data: responsesData, error: responsesError } = await supabase
      .from('interview_responses')
      .select('*')
      .limit(1);
      
    if (responsesError) {
      console.error('[DB Test] interview_responses table error:', responsesError);
    } else {
      console.log('[DB Test] interview_responses table accessible');
      if (responsesData && responsesData.length > 0) {
        console.log('[DB Test] interview_responses columns:', Object.keys(responsesData[0]));
      }
    }
    
    return {
      success: true,
      tables: {
        mock_interviews: !interviewError,
        interview_questions: !questionsError,
        interview_responses: !responsesError
      }
    };
    
  } catch (error) {
    console.error('[DB Test] Table structure test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Test creating a sample interview question to verify schema
export async function testInterviewQuestionInsertion() {
  try {
    console.log('[DB Test] Testing interview question insertion...');
    
    const testUserId = 'test-user-' + Date.now();
    
    // First create a test resume (required for foreign key)
    const { data: testResume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: testUserId,
        file_name: 'test-resume.pdf',
        file_url: 'https://example.com/test-resume.pdf',
        file_size: 1024,
        parsing_status: 'completed'
      } as any)
      .select('id')
      .single();
    
    if (resumeError) {
      console.error('[DB Test] Error creating test resume:', resumeError);
      return { success: false, error: resumeError.message };
    }
    
    // Create a test job description (required for foreign key)
    const { data: testJobDesc, error: jobDescError } = await supabase
      .from('job_descriptions')
      .insert({
        user_id: testUserId,
        company_name: 'Test Company',
        role_title: 'Test Role',
        description: 'Test job description'
      } as any)
      .select('id')
      .single();
    
    if (jobDescError) {
      console.error('[DB Test] Error creating test job description:', jobDescError);
      
      // Clean up the test resume
      await supabase.from('resumes').delete().eq('id', testResume.id);
      
      return { success: false, error: jobDescError.message };
    }
    
    // Now create a test mock interview
    const { data: testInterview, error: interviewError } = await supabase
      .from('mock_interviews')
      .insert({
        user_id: testUserId,
        resume_id: testResume.id,
        job_description_id: testJobDesc.id,
        company_name: 'Test Company',
        role_title: 'Test Role',
        status: 'pending',
        interview_type: 'predefined' // Valid values: 'predefined' or 'custom'
      } as any)
      .select('id')
      .single();
    
    if (interviewError) {
      console.error('[DB Test] Error creating test interview:', interviewError);
      
      // Clean up test data
      await supabase.from('job_descriptions').delete().eq('id', testJobDesc.id);
      await supabase.from('resumes').delete().eq('id', testResume.id);
      
      return { success: false, error: interviewError.message };
    }
    
    const testInterviewId = testInterview.id;
    console.log('[DB Test] Created test interview:', testInterviewId);
    
    // Now test inserting a question with order_index
    const { data: testQuestion, error: questionError } = await supabase
      .from('interview_questions')
      .insert({
        mock_interview_id: testInterviewId,
        question_text: 'Test question for schema verification',
        question_type: 'behavioral',
        order_index: 1,
        ai_generated: false
      } as any)
      .select('*')
      .single();
    
    if (questionError) {
      console.error('[DB Test] Error creating test question:', questionError);
      
      // Clean up all test data
      await supabase.from('mock_interviews').delete().eq('id', testInterviewId);
      await supabase.from('job_descriptions').delete().eq('id', testJobDesc.id);
      await supabase.from('resumes').delete().eq('id', testResume.id);
      
      return { success: false, error: questionError.message };
    }
    
    console.log('[DB Test] Successfully created test question:', testQuestion);
    
    // Clean up all test data in reverse order of dependencies
    await supabase.from('interview_questions').delete().eq('id', testQuestion.id);
    await supabase.from('mock_interviews').delete().eq('id', testInterviewId);
    await supabase.from('job_descriptions').delete().eq('id', testJobDesc.id);
    await supabase.from('resumes').delete().eq('id', testResume.id);
    
    console.log('[DB Test] Cleaned up all test data');
    
    return { 
      success: true, 
      message: 'Interview question insertion test passed with all dependencies',
      questionColumns: Object.keys(testQuestion)
    };
    
  } catch (error) {
    console.error('[DB Test] Interview question insertion test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}