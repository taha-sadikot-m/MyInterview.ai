import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { JudgePanel } from "@/components/JudgePanel";
import InterviewHistory from "@/components/InterviewHistory";
import EvaluationResults from "@/components/EvaluationResults";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  Target, 
  Users, 
  Brain,
  TrendingUp,
  CheckCircle,
  Calendar,
  Download,
  Save,
  RotateCcw,
  Upload,
  FileText,
  History,
  Loader2
} from "lucide-react";
import { 
  uploadResume, 
  triggerResumeParser, 
  createJobDescription, 
  startMockInterview, 
  triggerMockInterview,
  getActiveResume,
  fetchInterviewQuestions,
  triggerInterviewEvaluation
} from "@/lib/interview-api";
import { supabase } from "@/integrations/supabase/client";

// Mock data
const COMPANY_CATEGORIES = {
  "IT Services & Consulting": ["TCS", "Infosys", "Wipro", "HCL", "Accenture"],
  "Product & Tech": ["Zoho", "Amazon", "Microsoft", "Google", "Adobe"],
  "Core Engineering": ["L&T", "Bosch", "Hyundai", "Ford", "Ashok Leyland"],
  "Consulting & Finance": ["Deloitte", "KPMG", "EY", "PwC", "Goldman Sachs", "JP Morgan"],
  "Startups & Unicorns": ["Flipkart", "Swiggy", "Zomato", "Freshworks"],
  "Other": ["Other"]
};

const JOB_ROLES = [
  "Software Engineer", 
  "Data Analyst", 
  "Cloud Engineer", 
  "QA Engineer",
  "GET (Core branches)",
  "Consulting Analyst", 
  "Business Analyst",
  "Custom"
];

const SUGGESTED_TOPICS = {
  "Software Engineer": ["DSA", "OOP", "SQL", "REST APIs", "Problem Solving", "Behavioural"],
  "Data Analyst": ["SQL", "Excel", "Statistics", "Data Visualization", "Communication", "Behavioural"],
  "Cloud Engineer": ["AWS", "Docker", "CI/CD", "DevOps", "Networking", "Problem Solving"],
  "QA Engineer": ["Testing", "Automation", "SDLC", "Bug Tracking", "Communication", "Behavioural"],
  "GET (Core branches)": ["Core Engineering", "Manufacturing", "CAD", "Problem Solving", "Communication", "Behavioural"],
  "Consulting Analyst": ["Case Studies", "Guesstimates", "Problem Solving", "Communication", "Presentation", "Behavioural"],
  "Business Analyst": ["Business Strategy", "Data Analysis", "Stakeholder Management", "Communication", "Problem Solving", "Behavioural"]
};

const SAMPLE_QUESTIONS = [
  "Tell me about yourself and why you're interested in this role.",
  "What are your biggest strengths and how do they apply to this position?",
  "Describe a challenging project you worked on during college.",
  "Why do you want to work at this company specifically?",
  "How do you handle pressure and tight deadlines?",
  "Where do you see yourself in 5 years?"
];

// Enhanced sample questions with follow-ups for testing
const SAMPLE_QUESTIONS_WITH_FOLLOWUPS = [
  {
    id: "q1",
    question: "Tell me about yourself and why you're interested in this role.",
    type: "behavioral",
    category: "introduction",
    competency: "communication",
    skill_area: "general",
    difficulty: "easy",
    follow_up: [
      "What specific aspect of this role excites you the most?",
      "How does this position align with your career goals?"
    ]
  },
  {
    id: "q2", 
    question: "Describe a challenging project you worked on during college.",
    type: "behavioral",
    category: "experience",
    competency: "problem_solving",
    skill_area: "general", 
    difficulty: "intermediate",
    follow_up: [
      "What was your specific role in this project?",
      "How did you overcome the main obstacles you faced?",
      "What would you do differently if you could redo this project?"
    ]
  },
  {
    id: "q3",
    question: "How do you handle pressure and tight deadlines?",
    type: "behavioral",
    category: "work_style",
    competency: "stress_management",
    skill_area: "general",
    difficulty: "intermediate",
    follow_up: [
      "Can you give me a specific example from your experience?",
      "What strategies do you use to prioritize tasks under pressure?"
    ]
  },
  {
    id: "q4",
    question: "What are your biggest strengths and how do they apply to this position?",
    type: "behavioral", 
    category: "self_assessment",
    competency: "self_awareness",
    skill_area: "general",
    difficulty: "easy",
    follow_up: []
  },
  {
    id: "q5",
    question: "Why do you want to work at this company specifically?",
    type: "behavioral",
    category: "motivation",
    competency: "company_knowledge", 
    skill_area: "general",
    difficulty: "easy",
    follow_up: []
  },
  {
    id: "q6",
    question: "Where do you see yourself in 5 years?",
    type: "behavioral",
    category: "career_planning",
    competency: "goal_setting",
    skill_area: "general", 
    difficulty: "easy",
    follow_up: []
  }
];

const HOW_IT_WORKS = [
  {
    number: "1",
    title: "Select Company & Role",
    description: "Choose your target company and fresher role from top recruiters",
    icon: Target
  },
  {
    number: "2",
    title: "Answer 5-6 Questions",
    description: "Respond to HR and role-specific questions using voice (90 sec max each)",
    icon: Brain
  },
  {
    number: "3",
    title: "Get Recruiter Feedback",
    description: "Receive detailed evaluation with competency scores and STAR reframe",
    icon: CheckCircle
  },
  {
    number: "4",
    title: "Follow 5-Day Plan",
    description: "Get personalized action plan to improve and track progress",
    icon: TrendingUp
  }
];

type Step = "setup" | "interview" | "feedback" | "history";

interface QuestionData {
  id: string; // Changed to string for compatibility
  question: string;
  type: string;
  category: string;
  competency?: string;
  skill_area?: string;
  difficulty?: string;
  follow_up?: string[];
}

interface QuestionResponse {
  questionId: string;
  question: string;
  answer: string;
  followUpResponses: Array<{
    question: string;
    answer: string;
  }>;
  timestamp: string;
}

interface InterviewData {
  company: string;
  customCompany?: string;
  role: string;
  customJobDescription?: string;
  resumeFile?: File;
  questions: string[]; // Simple questions for backward compatibility
  fullQuestions: QuestionData[]; // Full question objects with follow-ups
  answers: string[];
  currentQuestion: number; // Keep for backward compatibility
  currentQuestionIndex: number; // Current main question index
  currentSubQuestion: number; // Track main vs follow-up questions (0 = main question)
  questionResponses: QuestionResponse[]; // Store complete question-answer pairs
}

interface FeedbackData {
  overall: string;
  competencies: {
    Communication: number;
    StructuredThinkingSTAR: number;
    TechnicalFundamentals: number;
    ProblemSolving: number;
    CultureOwnership: number;
    Coachability: number;
  };
  evidence: string[];
  strengths: string[];
  improvements: string[];
  followUps: string[];
  starReframe: {
    before: string;
    after: string;
  };
  actionPlan: Array<{
    day: number;
    task: string;
  }>;
  score: number;
}

const MyInterviewWorld = () => {
  const { user, profile, signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [interviewData, setInterviewData] = useState<InterviewData>({
    company: "",
    customCompany: "",
    role: "",
    customJobDescription: "",
    resumeFile: undefined,
    questions: [],
    fullQuestions: [],
    answers: [],
    currentQuestion: 0,
    currentQuestionIndex: 0,
    currentSubQuestion: 0,
    questionResponses: []
  });
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUserId] = useState(user?.id || "guest-user"); // Use actual user ID from auth
  const [showQuestionPreview, setShowQuestionPreview] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<InterviewData>({
    company: "",
    role: "",
    questions: [],
    answers: [],
    currentQuestion: 0,
    fullQuestions: [],
    currentQuestionIndex: 0,
    currentSubQuestion: 0,
    questionResponses: []
  });
  const { toast } = useToast();

  // Handle authentication-required actions
  const handleAuthRequiredAction = (action: () => void, actionName: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: `Please sign up or login to ${actionName.toLowerCase()}`,
        variant: "destructive",
      });
      return;
    }
    action();
  };

  // Handle company selection
  const handleCompanySelection = () => {
    // For now, we'll scroll to the tabs section where company selection happens
    const tabsSection = document.querySelector('[role="tablist"]');
    if (tabsSection) {
      tabsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviewQuestions = async () => {
    if (!interviewData.company || !interviewData.role) {
      toast({
        title: "Missing Information",
        description: "Please select both company and role to preview questions.",
        variant: "destructive"
      });
      return;
    }

    setLoadingQuestions(true);

    try {
      // For demo purposes, generate mock questions based on role and company
      const mockQuestions = {
        introduction: `Welcome to your ${interviewData.role} interview at ${interviewData.company === "Other" ? interviewData.customCompany : interviewData.company}. Let's begin!`,
        question_sets: {
          behavioral: [
            {
              id: 1,
              question: "Tell me about yourself and why you're interested in this role.",
              type: "behavioral",
              competency: "communication"
            },
            {
              id: 2,
              question: "Describe a challenging project you worked on during your studies.",
              type: "behavioral",
              competency: "problem_solving"
            }
          ],
          technical: [
            {
              id: 3,
              question: interviewData.role === "Software Engineer" 
                ? "Explain the difference between REST and GraphQL APIs."
                : interviewData.role === "Data Analyst"
                ? "How would you handle missing data in a dataset?"
                : "What are your key technical skills for this role?",
              type: "technical",
              skill_area: interviewData.role.toLowerCase().replace(" ", "_")
            }
          ],
          situational: [
            {
              id: 4,
              question: "How would you handle a tight deadline on a project?",
              type: "situational",
              competency: "time_management"
            }
          ]
        },
        evaluation_criteria: {
          technical_depth: "Understanding of core concepts",
          communication: "Clarity and articulation",
          problem_solving: "Approach to challenges",
          cultural_fit: "Alignment with company values"
        }
      };

      setGeneratedQuestions(mockQuestions);
      setShowQuestionPreview(true);

    } catch (error) {
      console.error('Error generating question preview:', error);
      toast({
        title: "Preview Error",
        description: "Unable to generate question preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleStartInterview = async () => {
    // Check if user is authenticated first
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or login to start an interview",
        variant: "destructive",
      });
      return;
    }

    // Validation logic
    if (!interviewData.company || !interviewData.role) {
      toast({
        title: "Missing Information",
        description: "Please select both company and role to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for custom company name if "Other" is selected
    if (interviewData.company === "Other" && (!interviewData.customCompany || interviewData.customCompany.trim() === "")) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for custom job description if "Custom" role is selected
    if (interviewData.role === "Custom" && (!interviewData.customJobDescription || interviewData.customJobDescription.trim() === "")) {
      toast({
        title: "Job Description Required",
        description: "Please provide a job description for the custom role.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      let resumeId: string | undefined;
      let jobDescriptionId: string | undefined;

      // Handle resume upload if provided
      if (interviewData.resumeFile) {
        toast({
          title: "Uploading Resume",
          description: "Processing your resume..."
        });

        const { resume, error: uploadError } = await uploadResume(currentUserId, interviewData.resumeFile);
        if (uploadError) {
          throw new Error(`Resume upload failed: ${uploadError}`);
        }

        resumeId = resume.id;

        // Trigger resume parsing
        const { success: parseSuccess, error: parseError } = await triggerResumeParser(
          resume.id, 
          currentUserId
        );
        if (!parseSuccess) {
          console.warn('Resume parsing failed:', parseError);
          // Don't block the flow - just show a warning
          toast({
            title: "Resume Uploaded",
            description: "Resume uploaded successfully. AI parsing will continue in the background.",
            variant: "default"
          });
        } else {
          toast({
            title: "Resume Processing",
            description: "Resume uploaded and parsing initiated successfully.",
            variant: "default"
          });
        }
      }

      // Handle custom job description
      if (interviewData.role === "Custom" && interviewData.customJobDescription) {
        const companyName = interviewData.company === "Other" ? interviewData.customCompany! : interviewData.company;
        
        const { jobDescription, error: jobError } = await createJobDescription(
          currentUserId,
          companyName,
          "Custom Role",
          interviewData.customJobDescription
        );

        if (jobError) {
          throw new Error(`Job description creation failed: ${jobError}`);
        }

        jobDescriptionId = jobDescription.id;
      }

      // Start interview session
      const companyName = interviewData.company === "Other" ? interviewData.customCompany! : interviewData.company;
      const roleTitle = interviewData.role === "Custom" ? "Custom Role" : interviewData.role;

      const { interview, error: interviewError } = await startMockInterview({
        userId: currentUserId,
        resumeId,
        jobDescriptionId,
        companyName,
        roleTitle,
        interviewType: interviewData.role === "Custom" || interviewData.company === "Other" ? "custom" : "predefined",
        totalQuestions: 6
      });

      if (interviewError) {
        throw new Error(`Interview creation failed: ${interviewError}`);
      }

      // Set the current interview ID for database operations
      setCurrentInterviewId(interview.id);

      // Trigger N8N interview workflow
      console.log('Starting N8N workflow with data:', {
        interviewId: interview.id,
        userId: currentUserId,
        resumeId,
        jobDescriptionId,
        companyName,
        roleTitle
      });

      const { success: workflowSuccess, questions_generated, error: workflowError, interview_id: workflowInterviewId, workflow_questions } = await triggerMockInterview({
        interviewId: interview.id,
        userId: currentUserId,
        resumeId,
        jobDescriptionId,
        companyName,
        roleTitle,
        preferences: {
          totalQuestions: 6,
          focusAreas: ["technical", "behavioral", "situational"],
          difficultyLevel: "intermediate"
        }
      });

      console.log('N8N workflow result:', {
        success: workflowSuccess,
        questions_generated,
        error: workflowError,
        interview_id: workflowInterviewId,
        workflow_questions_count: workflow_questions?.length || 0
      });

      let finalQuestions = SAMPLE_QUESTIONS; // Default fallback
      let questionsSource = "sample"; // Track source for user feedback

      // Always use our originally created interview ID to prevent duplicates
      // The N8N workflow should update the existing record, not create a new one
      const interviewIdToFetch = interview.id;
      console.log('Interview IDs - Created:', interview.id, 'Workflow returned:', workflowInterviewId, 'Using for fetch (to prevent duplicates):', interviewIdToFetch);
      
      // Handle duplicate prevention: If workflow created a different interview ID, clean it up
      if (workflowInterviewId && workflowInterviewId !== interview.id) {
        console.warn('[Interview] N8N workflow created different interview ID. Cleaning up duplicate to prevent history duplication.');
        console.warn('[Interview] Original ID:', interview.id, 'Workflow ID:', workflowInterviewId);
        
        try {
          // Delete the duplicate record created by N8N workflow
          const { error: deleteError } = await supabase
            .from('mock_interviews')
            .delete()
            .eq('id', workflowInterviewId);
            
          if (deleteError) {
            console.error('[Interview] Error deleting duplicate interview record:', deleteError);
          } else {
            console.log('[Interview] Successfully deleted duplicate interview record:', workflowInterviewId);
          }
        } catch (error) {
          console.error('[Interview] Error handling duplicate cleanup:', error);
        }
      }

      if (workflowSuccess) {
        toast({
          title: "Workflow Started",
          description: "AI is generating your personalized interview questions...",
          variant: "default"
        });

        // First try to use questions directly from workflow response
        if (workflow_questions && Array.isArray(workflow_questions) && workflow_questions.length > 0) {
          console.log('Using questions directly from workflow response:', workflow_questions);
          finalQuestions = workflow_questions.map(q => q.question || q.text || String(q));
          questionsSource = "ai";
          
          toast({
            title: "Interview Ready",
            description: `AI generated ${workflow_questions.length} personalized interview questions!`,
            variant: "default"
          });
        } else {
          console.log('No questions in workflow response, trying database fetch...');
          
          // Fallback: Wait for the workflow to complete and fetch the generated questions from database
          let retryCount = 0;
          const maxRetries = 5; // Reduced to 15 seconds (3 second intervals)
          
          while (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
            
            try {
              const { questions, success: fetchSuccess, error: fetchError } = await fetchInterviewQuestions(interviewIdToFetch);
              
              if (fetchSuccess && questions.length > 0) {
                // Convert AI questions to the format expected by the UI
                finalQuestions = questions.map(q => q.question || q.text || String(q));
                questionsSource = "ai";
                
                toast({
                  title: "Interview Ready",
                  description: `AI generated ${questions.length} personalized interview questions!`,
                  variant: "default"
                });
                break;
              } else if (fetchError) {
                console.warn(`Attempt ${retryCount + 1}: ${fetchError}`);
              }
            } catch (fetchError) {
              console.warn(`Attempt ${retryCount + 1}: Failed to fetch questions:`, fetchError);
            }
            
            retryCount++;
          }

          if (retryCount >= maxRetries) {
            console.log('Database fetch timed out, using sample questions');
            toast({
              title: "Using Sample Questions",
              description: "AI generation took too long, proceeding with sample questions.",
              variant: "default"
            });
          }
        }
      } else {
        // Workflow failed, use sample questions immediately
        console.warn('N8N workflow failed, using sample questions:', workflowError);
        toast({
          title: "Using Sample Questions",
          description: workflowError || "AI generation not available, using sample questions.",
          variant: "default"
        });
      }

      // Ensure we always have questions to start the interview
      if (!finalQuestions || finalQuestions.length === 0) {
        console.log('No questions available, falling back to enhanced sample questions');
        finalQuestions = SAMPLE_QUESTIONS;
        questionsSource = "sample";
      }

      // Set up the interview with the determined questions
      console.log('Setting up interview with questions:', {
        source: questionsSource,
        count: finalQuestions.length,
        questions: finalQuestions.slice(0, 2) // Log first 2 for debugging
      });

      setInterviewData(prev => ({
        ...prev,
        questions: finalQuestions,
        answers: new Array(finalQuestions.length).fill(""),
        currentQuestion: 0
      }));

      // Also set currentData for the new interview flow
      if (questionsSource === "ai" && workflow_questions && Array.isArray(workflow_questions)) {
        // Use full question objects if available
        setCurrentData(prev => ({
          ...prev,
          company: companyName,
          role: roleTitle,
          fullQuestions: workflow_questions,
          questions: finalQuestions,
          answers: new Array(finalQuestions.length).fill(""),
          currentQuestion: 0,
          currentQuestionIndex: 0,
          currentSubQuestion: 0,
          questionResponses: []
        }));
        
        // Update interview record with actual total questions count
        updateInterviewTotalQuestions(workflow_questions);
      } else {
        // Use enhanced sample questions with follow-ups for better testing
        console.log('Using enhanced sample questions with follow-ups');
        const enhancedQuestions = SAMPLE_QUESTIONS_WITH_FOLLOWUPS;
        
        setCurrentData(prev => ({
          ...prev,
          company: companyName,
          role: roleTitle,
          fullQuestions: enhancedQuestions,
          questions: enhancedQuestions.map(q => q.question),
          answers: new Array(enhancedQuestions.length).fill(""),
          currentQuestion: 0,
          currentQuestionIndex: 0,
          currentSubQuestion: 0,
          questionResponses: []
        }));
        
        // Update interview record with actual total questions count
        updateInterviewTotalQuestions(enhancedQuestions);
      }

      toast({
        title: "Interview Started",
        description: `Your mock interview has begun with ${questionsSource === "ai" ? "AI-generated" : "sample"} questions!`,
        variant: "default"
      });

      console.log('Transitioning to interview step...');
      setCurrentStep("interview");

    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error Starting Interview",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, transcript: string) => {
    console.log('[Interview] Recording completed:', { transcript });
    
    // Simply store the audio and transcript without advancing
    // The advancement will only happen when "Next Question" button is clicked
    console.log('[Interview] Audio recorded and transcript ready');
  };

  const saveInterviewResponses = async (responses: QuestionResponse[]) => {
    if (!currentInterviewId) {
      console.error('[Database] No interview ID available for saving responses');
      return;
    }

    try {
      console.log('[Database] Saving responses to database:', responses.length, 'responses');
      console.log('[Database] Current interview ID:', currentInterviewId);
      
      for (const response of responses) {
        console.log('[Database] Processing response for question:', response.question.substring(0, 50) + '...');
        
        // First, create/get the question in interview_questions table
        const { data: existingQuestion, error: questionQueryError } = await supabase
          .from('interview_questions')
          .select('id')
          .eq('mock_interview_id', currentInterviewId)
          .eq('question_text', response.question)
          .single();

        let questionId = existingQuestion?.id;

        if (!questionId) {
          console.log('[Database] Creating new question record with order_index:', responses.indexOf(response) + 1);
          // Create new question record
          // Note: Using any type assertion due to TypeScript types being out of sync with actual database schema
          const { data: newQuestion, error: questionInsertError } = await supabase
            .from('interview_questions')
            .insert({
              mock_interview_id: currentInterviewId,
              question_text: response.question,
              question_type: 'behavioral',
              order_index: responses.indexOf(response) + 1, // Database uses order_index, not question_number
              ai_generated: true
            } as any)
            .select('id')
            .single();

          if (questionInsertError) {
            console.error('[Database] Error creating question:', questionInsertError);
            continue;
          }

          questionId = newQuestion?.id;
          console.log('[Database] Successfully created question with ID:', questionId);
        } else {
          console.log('[Database] Found existing question with ID:', questionId);
        }

        if (questionId) {
          // Save the main response
          const { error: responseError } = await supabase
            .from('interview_responses')
            .insert({
              question_id: questionId,
              mock_interview_id: currentInterviewId,
              response_text: response.answer,
              responded_at: response.timestamp,
              created_at: new Date().toISOString()
            });

          if (responseError) {
            console.error('[Database] Error saving main response:', responseError);
          } else {
            console.log('[Database] Successfully saved main response for question:', response.question.substring(0, 50));
          }

          // Save follow-up responses if any
          for (const followUp of response.followUpResponses) {
            // Create follow-up question record
            // Note: Using any type assertion due to TypeScript types being out of sync with actual database schema
            const { data: followUpQuestion, error: followUpQuestionError } = await supabase
              .from('interview_questions')
              .insert({
                mock_interview_id: currentInterviewId,
                question_text: followUp.question,
                question_type: 'behavioral',
                order_index: Math.floor((responses.indexOf(response) + 1) * 10 + response.followUpResponses.indexOf(followUp) + 1), // Sub-numbering for follow-ups: 10, 11, 12 for Q1 follow-ups
                ai_generated: true
              } as any)
              .select('id')
              .single();

            if (followUpQuestionError) {
              console.error('[Database] Error creating follow-up question:', followUpQuestionError);
              continue;
            }

            // Save follow-up response
            if (followUpQuestion?.id) {
              const { error: followUpResponseError } = await supabase
                .from('interview_responses')
                .insert({
                  question_id: followUpQuestion.id,
                  mock_interview_id: currentInterviewId,
                  response_text: followUp.answer,
                  responded_at: new Date().toISOString(),
                  created_at: new Date().toISOString()
                });

              if (followUpResponseError) {
                console.error('[Database] Error saving follow-up response:', followUpResponseError);
              } else {
                console.log('[Database] Successfully saved follow-up response');
              }
            }
          }
        }
      }

      console.log('[Database] All responses saved successfully');
    } catch (error) {
      console.error('[Database] Error saving responses:', error);
    }
  };

  // Helper function to update interview progress
  const updateInterviewProgress = async (responses: QuestionResponse[]) => {
    if (!currentInterviewId) return;

    // Calculate total questions asked (main + follow-ups)
    let totalQuestionsAsked = 0;
    let totalQuestionsAnswered = 0;
    
    responses.forEach(response => {
      totalQuestionsAsked += 1; // Main question
      totalQuestionsAnswered += 1; // Main question answered
      totalQuestionsAsked += response.followUpResponses.length; // Follow-up questions
      totalQuestionsAnswered += response.followUpResponses.length; // Follow-up questions answered
    });

    try {
      const { error } = await supabase
        .from('mock_interviews')
        .update({
          total_questions: totalQuestionsAsked,
          questions_answered: totalQuestionsAnswered
        })
        .eq('id', currentInterviewId);

      if (error) {
        console.error('[Interview] Error updating progress:', error);
      } else {
        console.log('[Interview] Updated progress:', {
          total_questions: totalQuestionsAsked,
          questions_answered: totalQuestionsAnswered
        });
      }
    } catch (error) {
      console.error('[Interview] Error updating interview progress:', error);
    }
  };

  // Helper function to update total questions count when questions are loaded
  const updateInterviewTotalQuestions = async (questions: any[]) => {
    if (!currentInterviewId) return;

    // Calculate total possible questions (main + all possible follow-ups)
    let totalPossibleQuestions = 0;
    
    questions.forEach(question => {
      totalPossibleQuestions += 1; // Main question
      if (question.follow_up && Array.isArray(question.follow_up)) {
        totalPossibleQuestions += question.follow_up.length; // Follow-up questions
      }
    });

    try {
      const { error } = await supabase
        .from('mock_interviews')
        .update({
          total_questions: totalPossibleQuestions
        })
        .eq('id', currentInterviewId);

      if (error) {
        console.error('[Interview] Error updating total questions:', error);
      } else {
        console.log('[Interview] Updated total possible questions:', totalPossibleQuestions);
      }
    } catch (error) {
      console.error('[Interview] Error updating total questions:', error);
    }
  };

  // Helper function to trigger evaluation workflow
  const triggerEvaluationWorkflow = async (responses: QuestionResponse[], totalQuestions: number, questionsAnswered: number) => {
    if (!currentInterviewId) {
      console.error('[Evaluation] No interview ID available');
      return;
    }

    try {
      setEvaluationLoading(true);
      console.log('[Evaluation] Starting evaluation workflow...');

      // Format questions and answers for evaluation
      const questionsAndAnswers = responses.map(response => ({
        question: response.question,
        answer: response.answer,
        followUps: response.followUpResponses.map(followUp => ({
          question: followUp.question,
          answer: followUp.answer
        }))
      }));

      // Get company and role from current data
      const companyName = currentData.company || interviewData.company;
      const roleTitle = currentData.role || interviewData.role;

      const evaluationResult = await triggerInterviewEvaluation({
        interviewId: currentInterviewId,
        userId: currentUserId,
        companyName,
        roleTitle,
        questionsAndAnswers,
        totalQuestions,
        questionsAnswered
      });

      if (evaluationResult.success && evaluationResult.evaluation) {
        console.log('[Evaluation] Evaluation completed successfully');
        setEvaluationData(evaluationResult.evaluation);

        // Store evaluation results in database
        const { error: updateError } = await supabase
          .from('mock_interviews')
          .update({
            overall_score: evaluationResult.evaluation.overall_score,
            competency_scores: evaluationResult.evaluation.competency_scores,
            strengths: evaluationResult.evaluation.strengths,
            improvements: evaluationResult.evaluation.improvements,
            feedback_summary: evaluationResult.evaluation.feedback_summary
          })
          .eq('id', currentInterviewId);

        if (updateError) {
          console.error('[Evaluation] Error storing evaluation results:', updateError);
        } else {
          console.log('[Evaluation] Evaluation results stored in database');
        }

        toast({
          title: "Evaluation Complete! ✨",
          description: "Your personalized interview evaluation is ready.",
          variant: "default"
        });
      } else {
        console.error('[Evaluation] Evaluation failed:', evaluationResult.error);
        toast({
          title: "Evaluation Error",
          description: "Failed to generate evaluation. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[Evaluation] Error triggering evaluation:', error);
      toast({
        title: "Evaluation Error",
        description: "An error occurred while generating your evaluation.",
        variant: "destructive"
      });
    } finally {
      setEvaluationLoading(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!currentData.fullQuestions || currentData.fullQuestions.length === 0) {
      return null;
    }
    
    const currentQuestion = currentData.fullQuestions[currentData.currentQuestionIndex];
    
    // Return main question if we're at sub-question 0
    if (currentData.currentSubQuestion === 0) {
      return {
        text: currentQuestion.question,
        number: currentData.currentQuestionIndex + 1,
        isFollowUp: false,
        totalQuestions: currentData.fullQuestions.length
      };
    }
    
    // Return follow-up question
    if (currentQuestion.follow_up && currentQuestion.follow_up[currentData.currentSubQuestion - 1]) {
      return {
        text: currentQuestion.follow_up[currentData.currentSubQuestion - 1],
        number: currentData.currentQuestionIndex + 1,
        isFollowUp: true,
        followUpNumber: currentData.currentSubQuestion,
        totalQuestions: currentData.fullQuestions.length
      };
    }
    
    return null;
  };

  const handleTranscriptUpdate = (transcript: string) => {
    setCurrentAnswer(transcript);
    // Clear error when user starts speaking
    if (error && transcript.trim()) {
      setError('');
    }
  };

  const isLastQuestion = () => {
    if (!currentData.fullQuestions || currentData.fullQuestions.length === 0) {
      return false;
    }
    
    const currentQuestion = currentData.fullQuestions[currentData.currentQuestionIndex];
    const isLastMainQuestion = currentData.currentQuestionIndex === currentData.fullQuestions.length - 1;
    
    // If we're on the last main question
    if (isLastMainQuestion) {
      // If we're on a main question (sub-question 0) and there are no follow-ups, it's the last question
      if (currentData.currentSubQuestion === 0 && (!currentQuestion.follow_up || currentQuestion.follow_up.length === 0)) {
        return true;
      }
      // If we're on the last follow-up of the last main question, it's the last question
      if (currentData.currentSubQuestion > 0 && currentQuestion.follow_up && 
          currentData.currentSubQuestion === currentQuestion.follow_up.length) {
        return true;
      }
    }
    
    return false;
  };

  const getNextButtonText = () => {
    if (isLoading) return "Processing...";
    if (isLastQuestion()) return "Complete Interview";
    return "Next Question →";
  };

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide an answer before proceeding to the next question.');
      return;
    }

    try {
      setIsLoading(true);
      
      const currentQuestion = currentData.fullQuestions[currentData.currentQuestionIndex];
      let updatedResponses = [...currentData.questionResponses];
      
      if (currentData.currentSubQuestion === 0) {
        // This is a main question response
        const questionResponse: QuestionResponse = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answer: currentAnswer,
          followUpResponses: [],
          timestamp: new Date().toISOString()
        };
        updatedResponses.push(questionResponse);
        console.log('[Interview] Stored main question response');
      } else {
        // This is a follow-up question response
        const followUpQuestion = currentQuestion.follow_up![currentData.currentSubQuestion - 1];
        const followUpResponse = {
          question: followUpQuestion,
          answer: currentAnswer,
          timestamp: new Date().toISOString()
        };
        
        // Find the main question response and add follow-up
        const mainQuestionIndex = updatedResponses.findIndex(r => r.questionId === currentQuestion.id);
        if (mainQuestionIndex !== -1) {
          updatedResponses[mainQuestionIndex].followUpResponses.push(followUpResponse);
          console.log('[Interview] Stored follow-up response');
        }
      }
      
      // Check if this is a main question and has follow-ups
      if (currentData.currentSubQuestion === 0 && currentQuestion.follow_up && currentQuestion.follow_up.length > 0) {
        console.log('[Interview] Moving to first follow-up question');
        setCurrentData(prev => ({
          ...prev,
          currentSubQuestion: 1,
          questionResponses: updatedResponses
        }));
        setCurrentAnswer('');
        
        // Update progress - main question answered
        await updateInterviewProgress(updatedResponses);
        return;
      }

      // Check if we're in follow-ups and there are more
      if (currentData.currentSubQuestion > 0 && 
          currentQuestion.follow_up && 
          currentData.currentSubQuestion < currentQuestion.follow_up.length) {
        console.log('[Interview] Moving to next follow-up question');
        setCurrentData(prev => ({
          ...prev,
          currentSubQuestion: prev.currentSubQuestion + 1,
          questionResponses: updatedResponses
        }));
        setCurrentAnswer('');
        return;
      }

      // Move to next main question
      if (currentData.currentQuestionIndex < currentData.fullQuestions.length - 1) {
        console.log('[Interview] Moving to next main question');
        setCurrentData(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentSubQuestion: 0,
          questionResponses: updatedResponses
        }));
        setCurrentAnswer('');
        
        // Update progress - main question completed (including follow-ups if any)
        await updateInterviewProgress(updatedResponses);
      } else {
        // Interview completed
        console.log('[Interview] Interview completed');
        setCurrentData(prev => ({
          ...prev,
          questionResponses: updatedResponses
        }));
        
        // Save to database
        await saveInterviewResponses(updatedResponses);
        
        // Calculate final totals including all main and follow-up questions
        let totalQuestionsAsked = 0;
        let totalQuestionsAnswered = 0;
        
        updatedResponses.forEach(response => {
          totalQuestionsAsked += 1; // Main question
          totalQuestionsAnswered += 1; // Main question answered
          totalQuestionsAsked += response.followUpResponses.length; // Follow-up questions
          totalQuestionsAnswered += response.followUpResponses.length; // Follow-up questions answered
        });

        // Update interview status to completed
        if (currentInterviewId) {
          try {
            const { error: updateError } = await supabase
              .from('mock_interviews')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                total_questions: totalQuestionsAsked,
                questions_answered: totalQuestionsAnswered,
                overall_score: null, // Will be set when feedback is generated
              })
              .eq('id', currentInterviewId);

            if (updateError) {
              console.error('[Interview] Error updating interview status:', updateError);
            } else {
              console.log('[Interview] Interview status updated to completed with totals:', {
                total_questions: totalQuestionsAsked,
                questions_answered: totalQuestionsAnswered
              });
            }
          } catch (error) {
            console.error('[Interview] Error updating interview:', error);
          }
        }
        
        // Set interview data for feedback generation
        setInterviewData(prev => ({
          ...prev,
          answers: updatedResponses.map(r => r.answer),
          questionResponses: updatedResponses
        }));
        
        // Trigger evaluation workflow
        await triggerEvaluationWorkflow(updatedResponses, totalQuestionsAsked, totalQuestionsAnswered);
        
        // Transition to feedback step
        setCurrentStep("feedback");
        
        toast({
          title: "Interview Completed! 🎉",
          description: "Generating your personalized evaluation...",
          variant: "default"
        });
      }

    } catch (error) {
      console.error('[Interview] Error handling next question:', error);
      setError('Failed to process your response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFeedback = () => {
    setFeedbackLoading(true);
    
    // Mock feedback generation
    setTimeout(() => {
      const mockFeedback: FeedbackData = {
        overall: "Hire",
        competencies: {
          Communication: 4,
          StructuredThinkingSTAR: 3,
          TechnicalFundamentals: 4,
          ProblemSolving: 3,
          CultureOwnership: 4,
          Coachability: 5
        },
        evidence: [
          "I have strong technical skills from my computer science background",
          "I led a team project where we developed a web application",
          "I'm passionate about learning new technologies"
        ],
        strengths: [
          "Clear communication style and confident delivery",
          "Strong technical foundation and problem-solving approach",
          "Positive attitude and eagerness to learn"
        ],
        improvements: [
          "Use STAR framework for behavioral questions with specific examples",
          "Provide more quantifiable achievements and metrics",
          "Practice technical problem-solving with real scenarios"
        ],
        followUps: [
          "Can you walk me through your problem-solving process for debugging code?",
          "How do you stay updated with the latest technology trends?",
          "Tell me about a time you failed and what you learned from it."
        ],
        starReframe: {
          before: "I worked on a team project and it went well. Everyone contributed and we finished on time.",
          after: "Situation: During my final semester, our team of 5 was tasked with developing a food delivery app. Task: As the team lead, I needed to ensure timely delivery while maintaining code quality. Action: I implemented daily standups, divided work based on each member's strengths, and set up code review processes. Result: We delivered the project 2 days early, received the highest grade in class, and our app got 500+ downloads from fellow students."
        },
        actionPlan: [
          { day: 1, task: "Practice answering 'Tell me about yourself' using STAR format with 3 key achievements" },
          { day: 2, task: "Research your target company's recent projects, values, and interview process" },
          { day: 3, task: "Prepare 5 specific examples of challenges you overcame with quantifiable results" },
          { day: 4, task: "Practice technical questions specific to your role with online coding platforms" },
          { day: 5, task: "Do a mock interview with friends and record yourself to analyze body language" }
        ],
        score: 8
      };
      
      setFeedbackData(mockFeedback);
      setCurrentStep("feedback");
      setFeedbackLoading(false);
    }, 2000);
  };

  const resetInterview = () => {
    setCurrentStep("setup");
    setInterviewData({
      company: "",
      role: "",
      questions: [],
      answers: [],
      currentQuestion: 0,
      fullQuestions: [],
      currentQuestionIndex: 0,
      currentSubQuestion: 0,
      questionResponses: []
    });
    setCurrentData({
      company: "",
      role: "",
      questions: [],
      answers: [],
      currentQuestion: 0,
      fullQuestions: [],
      currentQuestionIndex: 0,
      currentSubQuestion: 0,
      questionResponses: []
    });
    setFeedbackData(null);
  };

  const progress = currentStep === "interview" ? 
    ((currentData.currentQuestionIndex + 1) / (currentData.fullQuestions?.length || 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Authentication Header */}
      <div className="fixed top-0 right-0 z-50 p-6">
        {user ? (
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl shadow-black/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {(profile?.full_name || user?.email || '').charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{profile?.full_name || user?.email}</div>
                <div className="text-gray-500 text-xs">{user?.email}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => signOut()}
              className="text-xs border-gray-200 hover:bg-gray-50 transition-all duration-200 rounded-lg"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-2xl shadow-black/10">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => window.location.href = '/register'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 rounded-lg shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/login'}
              className="border-gray-200 hover:bg-gray-50 transition-all duration-200 rounded-lg"
            >
              Login
            </Button>
          </div>
        )}
      </div>

      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-[140px] overflow-hidden">
        {/* Advanced gradient overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary gradient mesh */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-600/10 via-blue-600/5 to-transparent"></div>
          
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Modern badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-8 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">AI-Powered Interview Training</span>
            </div>
            
            {/* Modern headline with gradient */}
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight mb-6">
              MyInterview.ai
            </h1>
            
            {/* Modern tagline */}
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-700 mb-6 tracking-wide">
              Let the Dream Job Land on You
            </h2>
            
            {/* Enhanced subtext */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Register details those instructions Start interview
            </p>
            
            {/* Modern action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {/* Primary CTA */}
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => handleAuthRequiredAction(() => {
                  window.location.href = '/register';
                }, "Register Details")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <span>Register Details</span>
                </div>
              </Button>
              
              {/* Secondary actions */}
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-white/80 backdrop-blur-xl border-2 border-white/20 hover:border-blue-200 text-gray-700 hover:text-blue-700 text-lg px-8 py-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => handleAuthRequiredAction(handleCompanySelection, "Choose Company")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏢</span>
                  <span>Choose Company</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-white/80 backdrop-blur-xl border-2 border-white/20 hover:border-purple-200 text-gray-700 hover:text-purple-700 text-lg px-8 py-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => handleAuthRequiredAction(() => {
                  const tabsSection = document.querySelector('[role="tablist"]');
                  if (tabsSection) {
                    tabsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, "Select JD Role")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">👨‍💼</span>
                  <span>Select JD Role</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-white/80 backdrop-blur-xl border-2 border-white/20 hover:border-green-200 text-gray-700 hover:text-green-700 text-lg px-8 py-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => handleAuthRequiredAction(() => {
                  const tabsSection = document.querySelector('[role="tablist"]');
                  if (tabsSection) {
                    tabsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, "Start Interview")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🎥</span>
                  <span>Start Interview</span>
                </div>
              </Button>
            </div>
            
            {/* Secondary action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-white/60 backdrop-blur-xl border border-white/30 hover:border-blue-300 text-gray-600 hover:text-blue-600 text-base px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">🎙️</span>
                  <span>Record Video Answer</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-white/60 backdrop-blur-xl border border-white/30 hover:border-purple-300 text-gray-600 hover:text-purple-600 text-base px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                  <span>Get AI Feedback</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-white/60 backdrop-blur-xl border border-white/30 hover:border-green-300 text-gray-600 hover:text-green-600 text-base px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">⬇️</span>
                  <span>Download Report</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Navigation Tabs - Fixed */}
      <section className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Tabs value={currentStep} onValueChange={(value) => {
            // Allow "setup" for everyone, but require auth for other tabs
            if (value !== "setup" && !user) {
              toast({
                title: "Authentication Required",
                description: "Please sign up or login to access this feature",
                variant: "destructive",
              });
              return;
            }
            setCurrentStep(value as Step);
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-5xl mx-auto bg-white/80 backdrop-blur-xl p-3 rounded-3xl border-2 border-white/30 shadow-2xl">
              <TabsTrigger 
                value="setup" 
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-base transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-white/90 text-gray-700 hover:text-gray-900"
              >
                <Target className="w-5 h-5" />
                <span className="hidden sm:inline">Setup</span>
                <span className="sm:hidden text-xs">Setup</span>
              </TabsTrigger>
              <TabsTrigger 
                value="interview" 
                disabled={currentStep === "setup"} 
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-base transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-white/90 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Briefcase className="w-5 h-5" />
                <span className="hidden sm:inline">Interview</span>
                <span className="sm:hidden text-xs">Interview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                disabled={!feedbackData && !evaluationData && !evaluationLoading} 
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-base transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-white/90 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="hidden sm:inline">Results</span>
                <span className="sm:hidden text-xs">Results</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-base transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-white/90 text-gray-700 hover:text-gray-900"
              >
                <History className="w-5 h-5" />
                <span className="hidden sm:inline">History</span>
                <span className="sm:hidden text-xs">History</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <div className="section-content">
        <Tabs value={currentStep} onValueChange={(value) => {
          // Allow "setup" for everyone, but require auth for other tabs
          if (value !== "setup" && !user) {
            toast({
              title: "Authentication Required",
              description: "Please sign up or login to access this feature",
              variant: "destructive",
            });
            return;
          }
          setCurrentStep(value as Step);
        }} className="w-full">
          <TabsContent value="setup" className="mt-0">
        {/* Modern How It Works Section - Full Width Background Fixed */}
        <section className="relative w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-20">
          {/* Full-width background with decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating orbs for visual interest */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          </div>
          
          {/* Content container */}
          <div className="w-full px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-8 shadow-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Step-by-Step Process</span>
              </div>
              <h2 className="font-heading text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight mb-6">
                How Interview World Works
              </h2>
              <p className="font-body text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                A comprehensive 4-step process to master your interview skills and land your dream job.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {HOW_IT_WORKS.map((step, index) => (
                <Card key={index} className="group relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                  
                  <CardHeader className="relative z-10 text-center p-8">
                    {/* Modern icon container */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Step number badge */}
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="font-ui font-bold text-white text-lg">{step.number}</span>
                    </div>
                    
                    <CardTitle className="font-heading text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="font-body text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Modern Interview Setup Flow */}
        {currentStep === "setup" && (
          <section className="section-padding fade-in">
            <Card className="relative max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              
              <CardHeader className="relative z-10 text-center p-12 bg-gradient-to-r from-blue-50/80 to-purple-50/80">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="font-heading text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                  Start Mock Interview
                </CardTitle>
                <CardDescription className="font-body text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Select your target company and position to begin practicing with AI-powered interview simulation
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 p-12 space-y-10">
                {/* Modern Company and Role Selection */}
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <label className="font-ui text-xl font-bold text-gray-800">Target Company</label>
                    </div>
                    <Select value={interviewData.company} onValueChange={(value) => 
                      setInterviewData(prev => ({ ...prev, company: value }))
                    }>
                      <SelectTrigger className="h-16 font-ui text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                        {Object.entries(COMPANY_CATEGORIES).map(([category, companies]) => (
                          <div key={category}>
                            <div className="px-4 py-3">
                              <div className="text-sm font-bold text-gray-800 uppercase tracking-wide bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-lg">
                                {category}
                              </div>
                            </div>
                            {companies.map(company => (
                              <SelectItem key={company} value={company} className="pl-6 font-body text-lg py-3 hover:bg-blue-50 rounded-lg mx-2">
                                {company}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Modern Custom Company Input */}
                    {interviewData.company === "Other" && (
                      <div className="space-y-4 animate-in fade-in-50 duration-300">
                        <label className="font-ui text-lg font-semibold text-gray-700">Company Name</label>
                        <Input
                          placeholder="Enter company name"
                          value={interviewData.customCompany || ""}
                          onChange={(e) => setInterviewData(prev => ({ ...prev, customCompany: e.target.value }))}
                          className="h-14 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <label className="font-ui text-xl font-bold text-gray-800">Job Role</label>
                    </div>
                    <Select value={interviewData.role} onValueChange={(value) => 
                      setInterviewData(prev => ({ ...prev, role: value }))
                    }>
                      <SelectTrigger className="h-16 font-ui text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <SelectValue placeholder="Select a job role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                        {JOB_ROLES.map(role => (
                          <SelectItem key={role} value={role} className="font-body text-lg py-3 hover:bg-purple-50 rounded-lg mx-2">{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Modern Custom Job Description */}
                {interviewData.role === "Custom" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📄</span>
                      </div>
                      <label className="font-ui text-xl font-bold text-gray-800">Job Description</label>
                    </div>
                    <Textarea
                      placeholder="Paste the complete job description here..."
                      value={interviewData.customJobDescription || ""}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, customJobDescription: e.target.value }))}
                      className="min-h-[160px] resize-none text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                    />
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                      <p className="text-base text-green-800 flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <span>Paste the complete job description to get personalized interview questions based on the specific role requirements and skills needed.</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Modern Resume Upload */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <label className="font-ui text-xl font-bold text-gray-800">Upload Resume (Optional)</label>
                  </div>
                  <div className="relative border-3 border-dashed border-blue-300 rounded-3xl p-10 text-center bg-gradient-to-br from-blue-50/80 to-purple-50/80 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100/80 hover:to-purple-100/80 transition-all duration-300 group">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                    
                    <div className="relative z-10 space-y-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="font-ui text-2xl font-bold text-gray-800 mb-3">Upload your resume (Max 3 pages)</p>
                        <p className="font-body text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                          Upload your resume (PDF only, max 3 pages) to get personalized questions based on your experience and skills
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validate file type
                            if (file.type !== 'application/pdf') {
                              toast({
                                title: "Invalid File Type",
                                description: "Please upload a PDF file only.",
                                variant: "destructive"
                              });
                              e.target.value = ''; // Clear the input
                              return;
                            }
                            
                            // Validate file size (10MB limit)
                            const maxSize = 10 * 1024 * 1024; // 10MB
                            if (file.size > maxSize) {
                              toast({
                                title: "File Too Large",
                                description: "Please upload a file smaller than 10MB.",
                                variant: "destructive"
                              });
                              e.target.value = ''; // Clear the input
                              return;
                            }
                            
                            setInterviewData(prev => ({ ...prev, resumeFile: file }));
                            toast({
                              title: "Resume Selected",
                              description: `${file.name} selected for upload. Page limit will be validated during processing.`,
                            });
                          }
                        }}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload">
                        <Button type="button" variant="outline" className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer" asChild>
                          <span className="flex items-center gap-3">
                            <FileText className="w-6 h-6" />
                            Choose PDF File
                          </span>
                        </Button>
                      </label>
                      {interviewData.resumeFile && (
                        <div className="flex items-center justify-center gap-3 text-lg text-green-700 bg-green-50 px-6 py-3 rounded-2xl border border-green-200 animate-in fade-in-50 duration-300">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-semibold">{interviewData.resumeFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-ui mb-4">
                    Fresher (0 years experience)
                  </Badge>
                  <p className="font-body text-foreground">
                    Designed specifically for fresh graduates and entry-level positions at top companies.
                  </p>
                </div>

                {interviewData.role && (
                  <div className="space-y-4">
                    <label className="font-ui text-lg font-medium text-foreground">Topics You'll Practice</label>
                    <div className="flex flex-wrap gap-3">
                      {SUGGESTED_TOPICS[interviewData.role as keyof typeof SUGGESTED_TOPICS]?.map(topic => (
                        <Badge key={topic} className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 font-ui">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question Preview Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-ui text-lg font-medium text-foreground">Question Preview</label>
                    <Button
                      onClick={handlePreviewQuestions}
                      disabled={
                        loadingQuestions ||
                        !interviewData.company || 
                        !interviewData.role ||
                        (interviewData.company === "Other" && (!interviewData.customCompany || interviewData.customCompany.trim() === ""))
                      }
                      variant="outline"
                      className="btn-outline"
                    >
                      {loadingQuestions ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Preview Questions
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {showQuestionPreview && generatedQuestions && (
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="font-heading text-xl text-primary flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Interview Questions Preview
                        </CardTitle>
                        <CardDescription className="font-body">
                          Here's what you can expect in your interview
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <p className="font-body text-blue-800">
                            <strong>Welcome Message:</strong> {generatedQuestions.introduction}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-ui font-semibold text-foreground">Behavioral Questions</h4>
                            {generatedQuestions.question_sets.behavioral.map((q: any, index: number) => (
                              <div key={q.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                <p className="font-body text-sm text-foreground">
                                  <strong>Q{index + 1}:</strong> {q.question}
                                </p>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {q.competency.replace('_', ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-ui font-semibold text-foreground">Technical Questions</h4>
                            {generatedQuestions.question_sets.technical.map((q: any, index: number) => (
                              <div key={q.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                <p className="font-body text-sm text-foreground">
                                  <strong>Q{generatedQuestions.question_sets.behavioral.length + index + 1}:</strong> {q.question}
                                </p>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  Technical
                                </Badge>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-ui font-semibold text-foreground">Situational Questions</h4>
                            {generatedQuestions.question_sets.situational.map((q: any, index: number) => (
                              <div key={q.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                <p className="font-body text-sm text-foreground">
                                  <strong>Q{generatedQuestions.question_sets.behavioral.length + generatedQuestions.question_sets.technical.length + index + 1}:</strong> {q.question}
                                </p>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {q.competency.replace('_', ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <h4 className="font-ui font-semibold text-green-800 mb-2">Evaluation Criteria</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {Object.entries(generatedQuestions.evaluation_criteria).map(([key, value]) => (
                              <div key={key} className="text-sm text-green-700">
                                <strong>{key.replace('_', ' ').toUpperCase()}:</strong> {value as string}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="font-body text-sm text-muted-foreground">
                            💡 Questions may vary based on your responses and interview flow
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleStartInterview}
                    disabled={
                      isProcessing ||
                      !interviewData.company || 
                      !interviewData.role ||
                      (interviewData.company === "Other" && (!interviewData.customCompany || interviewData.customCompany.trim() === "")) ||
                      (interviewData.role === "Custom" && (!interviewData.customJobDescription || interviewData.customJobDescription.trim() === ""))
                    }
                    className="btn-indigo min-w-[320px] h-16 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-6 h-6 mr-3" />
                        Start Interview Practice
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {feedbackLoading && (
          <section className="section-padding fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4 text-foreground">
                AI Recruiter Panel is Evaluating...
              </h2>
              <p className="font-body text-lg text-muted-foreground">
                Analyzing your responses and generating detailed feedback
              </p>
              <div className="mt-8">
                <Progress value={75} className="w-64 mx-auto h-2" />
              </div>
            </div>
          </section>
        )}

        {currentStep === "feedback" && feedbackData && !feedbackLoading && (
          <section className="section-padding fade-in">
            <JudgePanel type="interview" data={feedbackData} />
            
            <div className="flex justify-center gap-6 mt-12">
              <Button 
                onClick={resetInterview}
                className="btn-indigo"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Another Interview
              </Button>
              <Button variant="outline" className="btn-outline-indigo">
                <Save className="w-5 h-5 mr-2" />
                Save Attempt
              </Button>
              <Button variant="outline" className="btn-outline-indigo">
                <Download className="w-5 h-5 mr-2" />
                Download Report
              </Button>
            </div>
          </section>
        )}

        </TabsContent>

        <TabsContent value="interview" className="mt-0">
          {currentStep === "interview" && (
            <section className="relative w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-20 fade-in">
              <div className="max-w-7xl mx-auto px-4">
                {/* Modern Progress Header */}
                <Card className="relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl mb-10 overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                  
                  <CardContent className="relative z-10 p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                      <div className="flex-1">
                        {(() => {
                          const currentQ = getCurrentQuestion();
                          if (!currentQ) return null;
                          
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="font-heading text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                                  Interview Question
                                  {currentQ.isFollowUp && (
                                    <span className="text-2xl text-blue-600 ml-3 font-normal">
                                      (Follow-up {currentQ.followUpNumber})
                                    </span>
                                  )}
                                </h2>
                              </div>
                              <p className="font-body text-xl text-gray-600 max-w-2xl">
                                {currentQ.isFollowUp 
                                  ? "Follow-up question based on your previous answer - dive deeper into your response"
                                  : "Take your time, think through your answer, and respond confidently"
                                }
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 font-ui text-lg rounded-2xl shadow-lg">
                        {currentData.company} - {currentData.role}
                      </Badge>
                    </div>
                    
                    {/* Modern Progress Bar */}
                    <div className="relative">
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-700 ease-out shadow-lg"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-blue-600">{Math.round(progress)}% Complete</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Modern Question & Answer Interface */}
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Question Panel - Video Call Style */}
                  <div className="lg:col-span-2">
                    <Card className="relative h-full bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                      {/* Simulated video call header */}
                      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-white text-sm font-medium">AI Interviewer</div>
                        <div className="w-6 h-6"></div>
                      </div>
                      
                      <CardHeader className="p-8 bg-gradient-to-br from-blue-50/80 to-purple-50/80">
                        <CardTitle className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Q</span>
                          </div>
                          Interview Question
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-200 mb-8 shadow-inner">
                          <p className="font-body text-xl text-gray-800 leading-relaxed">
                            {(() => {
                              const currentQ = getCurrentQuestion();
                              return currentQ ? currentQ.text : 'Loading question...';
                            })()}
                          </p>
                        </div>
                        <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border border-blue-300">
                          <p className="font-body text-blue-800 text-lg flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <span><strong>Pro Tip:</strong> Use the STAR method (Situation, Task, Action, Result) for behavioral questions to structure your response effectively.</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Answer Panel - Modern Recording Interface */}
                  <div className="lg:col-span-3">
                    <Card className="relative h-full bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                      {/* Recording interface header */}
                      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-white font-semibold">Recording Your Response</span>
                        </div>
                        <div className="text-white text-sm">Max 90 seconds</div>
                      </div>
                      
                      <CardHeader className="p-8 bg-gradient-to-br from-green-50/80 to-blue-50/80">
                        <CardTitle className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                          </div>
                          Your Answer
                        </CardTitle>
                        <CardDescription className="font-body text-lg text-gray-600">
                          Record your response (maximum 90 seconds) - speak clearly and confidently
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        <VoiceRecorder 
                          onRecordingComplete={handleRecordingComplete}
                          onTranscriptUpdate={handleTranscriptUpdate}
                          placeholder="Press the mic button to start recording your answer"
                          maxDuration={90}
                        />
                        
                        {/* Live Transcript and Next Button */}
                        {currentAnswer && (
                          <div className="mt-8 space-y-6">
                            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl border-2 border-green-200 min-h-[120px] shadow-inner">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-semibold text-green-800">Live Transcript</span>
                              </div>
                              <p className="font-body text-green-800 text-lg whitespace-pre-wrap leading-relaxed">
                                {currentAnswer || "Start speaking to see your response here..."}
                              </p>
                            </div>
                            
                            {/* Next Question Button */}
                            <div className="text-center">
                              <Button 
                                onClick={handleNextQuestion}
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                              >
                                {getNextButtonText()}
                              </Button>
                              <p className="text-sm text-gray-600 mt-3">
                                {isLastQuestion() 
                                  ? "🎉 Click to complete your interview and get results" 
                                  : "➡️ Click when you're satisfied with your answer"
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Error Display */}
                    {error && (
                      <Card className="relative bg-red-50/80 backdrop-blur-xl border-2 border-red-200 rounded-3xl shadow-xl mt-6 overflow-hidden">
                        <CardContent className="p-6">
                          <div className="p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border border-red-300">
                            <p className="font-body text-red-800 text-lg flex items-start gap-3">
                              <span className="text-2xl">⚠️</span>
                              <span>{error}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          {currentStep === "feedback" && (
            <section className="section-padding fade-in">
              {evaluationLoading ? (
                <div className="max-w-4xl mx-auto text-center">
                  <Card className="card-world-class">
                    <CardContent className="py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <h3 className="font-heading text-2xl font-bold mb-2">Generating Your Evaluation...</h3>
                      <p className="text-muted-foreground">
                        Our AI is analyzing your responses and providing personalized feedback.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : evaluationData ? (
                <div className="max-w-6xl mx-auto">
                  <EvaluationResults 
                    evaluation={evaluationData} 
                    interviewData={{
                      company: interviewData.company || currentData.company || 'Test Company',
                      role: interviewData.role || currentData.role || 'Software Developer',
                      date: new Date().toLocaleDateString(),
                      duration: '30 minutes',
                      questionsAnswered: currentData.questionResponses?.length || 0,
                      totalQuestions: currentData.fullQuestions?.length || 0
                    }}
                    onDownloadPDF={() => {
                      toast({
                        title: "PDF Download",
                        description: "PDF download functionality coming soon!",
                      });
                    }}
                    onRetakeInterview={() => setCurrentStep("setup")}
                  />
                  <div className="flex justify-center gap-6 mt-12">
                    <Button onClick={() => setCurrentStep("setup")} className="btn-indigo">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Try Another Interview
                    </Button>
                    <Button variant="outline" className="btn-outline-indigo">
                      <Save className="w-5 h-5 mr-2" />
                      Save Attempt
                    </Button>
                    <Button variant="outline" className="btn-outline-indigo">
                      <Download className="w-5 h-5 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              ) : feedbackData ? (
                <div>
                  <JudgePanel type="interview" data={feedbackData} />
                  <div className="flex justify-center gap-6 mt-12">
                    <Button onClick={() => setCurrentStep("setup")} className="btn-indigo">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Try Another Interview
                    </Button>
                    <Button variant="outline" className="btn-outline-indigo">
                      <Save className="w-5 h-5 mr-2" />
                      Save Attempt
                    </Button>
                    <Button variant="outline" className="btn-outline-indigo">
                      <Download className="w-5 h-5 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto text-center">
                  <Card className="card-world-class">
                    <CardContent className="py-12">
                      <h3 className="font-heading text-2xl font-bold mb-4">Interview Completed!</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete an interview to see your evaluation results here.
                      </p>
                      <Button onClick={() => setCurrentStep("setup")} className="btn-primary">
                        Start New Interview
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <section className="section-padding">
            <InterviewHistory userId={currentUserId} />
          </section>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyInterviewWorld;