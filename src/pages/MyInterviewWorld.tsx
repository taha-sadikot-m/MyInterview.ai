import { useState } from "react";
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
  getActiveResume 
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

interface InterviewData {
  company: string;
  customCompany?: string;
  role: string;
  customJobDescription?: string;
  resumeFile?: File;
  questions: string[];
  answers: string[];
  currentQuestion: number;
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
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [interviewData, setInterviewData] = useState<InterviewData>({
    company: "",
    customCompany: "",
    role: "",
    customJobDescription: "",
    resumeFile: undefined,
    questions: [],
    answers: [],
    currentQuestion: 0
  });
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUserId] = useState("mock-user-id"); // Replace with actual user ID from auth
  const [showQuestionPreview, setShowQuestionPreview] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const { toast } = useToast();

  // Debug function to test Supabase storage
  const testSupabaseStorage = async () => {
    console.log('=== SUPABASE STORAGE DIAGNOSTIC ===');
    
    try {
      // Test 1: Check if supabase client is working
      const { data: testAuth, error: authError } = await supabase.auth.getSession();
      console.log('Auth test:', authError ? authError : 'OK');
      
      // Test 2: Try to list buckets
      console.log('Testing bucket listing...');
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      console.log('List buckets result:', { data: buckets, error: listError });
      
      if (buckets && buckets.length > 0) {
        console.log('Found buckets:');
        buckets.forEach(bucket => {
          console.log(`- ${bucket.name} (public: ${bucket.public}, id: ${bucket.id})`);
        });
      } else {
        console.log('No buckets found!');
      }
      
      // Test 3: Try different bucket names
      console.log('Testing different bucket name variations...');
      const testBuckets = ['resumes', 'Resumes', 'RESUMES', 'resume', 'Resume'];
      
      for (const bucketName of testBuckets) {
        try {
          const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
          console.log(`Bucket "${bucketName}":`, error ? `ERROR - ${error.message}` : 'EXISTS');
        } catch (e: any) {
          console.log(`Bucket "${bucketName}": ERROR -`, e.message);
        }
      }
      
      // Test 4: Try to create bucket
      console.log('Attempting to create "resumes" bucket...');
      try {
        const { data, error } = await supabase.storage.createBucket('resumes', {
          public: true,
          allowedMimeTypes: ['application/pdf'],
          fileSizeLimit: 10485760
        });
        console.log('Create bucket result:', { data, error });
      } catch (e: any) {
        console.error('Create bucket failed:', e);
      }
      
      console.log('=== END DIAGNOSTIC ===');
      console.log('Dashboard URL: https://app.supabase.com/project/sahcdkgvmvjzvvuzyilp/storage/buckets');
      
      toast({
        title: "Storage Test Complete",
        description: "Check browser console for detailed results",
      });
      
    } catch (error: any) {
      console.error('Storage test failed:', error);
      toast({
        title: "Storage Test Failed",
        description: error.message,
        variant: "destructive"
      });
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

      // Trigger N8N interview workflow
      const { success: workflowSuccess, error: workflowError } = await triggerMockInterview({
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

      // Always continue with sample questions for demo - don't block on N8N
      setInterviewData(prev => ({
        ...prev,
        questions: SAMPLE_QUESTIONS,
        answers: new Array(SAMPLE_QUESTIONS.length).fill(""),
        currentQuestion: 0
      }));

      if (!workflowSuccess) {
        console.warn('N8N workflow failed, continuing with sample questions:', workflowError);
      } else {
        console.log('N8N workflow triggered successfully');
      }

      toast({
        title: "Interview Started",
        description: "Your mock interview has begun!",
        variant: "default"
      });

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

  const handleRecordingComplete = (audioBlob: Blob, transcript: string) => {
    const newAnswers = [...interviewData.answers];
    newAnswers[interviewData.currentQuestion] = transcript;
    setInterviewData(prev => ({ ...prev, answers: newAnswers }));

    if (interviewData.currentQuestion + 1 < interviewData.questions.length) {
      setInterviewData(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      handleGenerateFeedback();
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
      currentQuestion: 0
    });
    setFeedbackData(null);
  };

  const progress = currentStep === "interview" ? 
    ((interviewData.currentQuestion + 1) / interviewData.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background py-[120px] overflow-hidden">
        {/* Subtle gradient overlay at edges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/5 to-transparent"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-gradient-to-t from-primary/3 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Headline */}
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-6">
              MyInterviewWorld
            </h1>
            
            {/* Tagline */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
              Your AI-powered placement coach
            </h2>
            
            {/* Subtext */}
            <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
              Practice real campus interviews with AI voices, video answers, and instant feedback tailored to company job roles.
            </h3>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                📝 Register Details
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                🏢 Choose Company
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                👨‍💼 Select JD Role
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                🎥 Start Interview
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                🎙️ Record Video Answer
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                📊 Get AI Feedback
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                ⬇️ Download Report (PDF)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as Step)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="interview" disabled={currentStep === "setup"} className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Interview
              </TabsTrigger>
              <TabsTrigger value="feedback" disabled={!feedbackData} className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <div className="section-content">
        <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as Step)} className="w-full">
          <TabsContent value="setup" className="mt-0">
        {/* How It Works Section */}
        <section className="section-padding">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
              How Interview World Works
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive 4-step process to master your interview skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {HOW_IT_WORKS.map((step, index) => (
              <Card key={index} className="card-world-class text-center hover-lift">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-ui font-bold text-white">{step.number}</span>
                  </div>
                  <CardTitle className="font-heading text-lg">{step.title}</CardTitle>
                  <CardDescription className="font-body">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Interview Flow */}
        {currentStep === "setup" && (
          <section className="section-padding fade-in">
            <Card className="card-world-class max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-heading text-4xl mb-4">Start Mock Interview</CardTitle>
                <CardDescription className="font-body text-lg">
                  Select your target company and position to begin practicing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="font-ui text-lg font-medium text-foreground">Target Company</label>
                    <Select value={interviewData.company} onValueChange={(value) => 
                      setInterviewData(prev => ({ ...prev, company: value }))
                    }>
                      <SelectTrigger className="h-14 font-ui">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COMPANY_CATEGORIES).map(([category, companies]) => (
                          <div key={category}>
                            <div className="px-2 py-1">
                              <div className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                {category}
                              </div>
                            </div>
                            {companies.map(company => (
                              <SelectItem key={company} value={company} className="pl-4 font-body">
                                {company}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Custom Company Input */}
                    {interviewData.company === "Other" && (
                      <div className="space-y-2">
                        <label className="font-ui text-sm font-medium text-foreground">Company Name</label>
                        <Input
                          placeholder="Enter company name"
                          value={interviewData.customCompany || ""}
                          onChange={(e) => setInterviewData(prev => ({ ...prev, customCompany: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="font-ui text-lg font-medium text-foreground">Job Role</label>
                    <Select value={interviewData.role} onValueChange={(value) => 
                      setInterviewData(prev => ({ ...prev, role: value }))
                    }>
                      <SelectTrigger className="h-14 font-ui">
                        <SelectValue placeholder="Select a job role" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_ROLES.map(role => (
                          <SelectItem key={role} value={role} className="font-body">{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Job Description */}
                {interviewData.role === "Custom" && (
                  <div className="space-y-4">
                    <label className="font-ui text-lg font-medium text-foreground">Job Description</label>
                    <Textarea
                      placeholder="Paste the job description here..."
                      value={interviewData.customJobDescription || ""}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, customJobDescription: e.target.value }))}
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      Paste the complete job description to get personalized interview questions based on the role requirements.
                    </p>
                  </div>
                )}

                {/* Resume Upload */}
                <div className="space-y-4">
                  <label className="font-ui text-lg font-medium text-foreground">Upload Resume (Optional)</label>
                  <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-ui text-lg font-medium text-foreground mb-2">Upload your resume (Max 3 pages)</p>
                        <p className="font-body text-muted-foreground text-sm">
                          Upload your resume (PDF only, max 3 pages) to get personalized questions based on your experience
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
                        <Button type="button" variant="outline" className="btn-outline cursor-pointer" asChild>
                          <span>
                            <FileText className="w-5 h-5 mr-2" />
                            Choose PDF File
                          </span>
                        </Button>
                      </label>
                      {interviewData.resumeFile && (
                        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          {interviewData.resumeFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Debug Storage Button - Remove in production */}
                <div className="space-y-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={testSupabaseStorage}
                    className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                  >
                    🐛 Debug Storage (Check Console)
                  </Button>
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

        {currentStep === "interview" && (
          <section className="section-padding fade-in">
            <div className="max-w-4xl mx-auto">
              {/* Progress Header */}
              <Card className="card-world-class mb-8">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                        Question {interviewData.currentQuestion + 1} of {interviewData.questions.length}
                      </h2>
                      <p className="font-body text-muted-foreground">
                        Take your time and answer confidently
                      </p>
                    </div>
                    <Badge className="bg-primary/10 text-primary px-4 py-2 font-ui">
                      {interviewData.company} - {interviewData.role}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-3 bg-muted rounded-full" />
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Question & Answer */}
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Question Panel */}
                <div className="lg:col-span-2">
                  <Card className="card-world-class h-full">
                    <CardHeader>
                      <CardTitle className="font-heading text-xl text-foreground">Interview Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 mb-6">
                        <p className="font-body text-lg text-foreground leading-relaxed">
                          {interviewData.questions[interviewData.currentQuestion]}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="font-body text-blue-800 text-sm">
                          💡 <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Answer Panel */}
                <div className="lg:col-span-3">
                  <Card className="card-world-class h-full">
                    <CardHeader>
                      <CardTitle className="font-heading text-xl text-foreground">Your Answer</CardTitle>
                      <CardDescription className="font-body">
                        Record your response (max 90 seconds)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VoiceRecorder 
                        onRecordingComplete={handleRecordingComplete}
                        placeholder="Press the mic button to start recording your answer"
                        maxDuration={90}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
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

        {/* Weekend Clinics Section */}
        <section className="section-padding bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold mb-4 text-foreground">
              Weekend Clinics
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Join our community mock interview sessions
            </p>
          </div>

          <Card className="card-world-class max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-heading text-2xl">Sunday Mock Interview Clinic</CardTitle>
              <CardDescription className="font-body">
                Next Session: This Sunday, 10:00 AM - 12:00 PM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-ui font-medium">Format:</span>
                  <span className="font-body">Group + 1-on-1 sessions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-ui font-medium">Duration:</span>
                  <span className="font-body">2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-ui font-medium">Spots Available:</span>
                  <span className="font-body">12/20</span>
                </div>
              </div>
              <Button className="btn-indigo w-full">
                <Users className="w-5 h-5 mr-2" />
                Register Now
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Services Strip */}
        <section className="section-padding">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold mb-4 text-foreground">
              1-on-1 Training
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Get personalized interview coaching
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="card-world-class text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl">Interview Coaching</CardTitle>
                <CardDescription className="font-body">
                  HR + role-specific practice with recruiter-style feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="btn-indigo w-full">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="card-world-class text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl">Company-Specific Prep</CardTitle>
                <CardDescription className="font-body">
                  Targeted preparation for your dream company's interview process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="btn-indigo w-full">Book Now</Button>
              </CardContent>
            </Card>
          </div>
        </section>
        </TabsContent>

        <TabsContent value="interview" className="mt-0">
          {currentStep === "interview" && (
            <section className="section-padding fade-in">
              <div className="max-w-4xl mx-auto">
                {/* This will contain the interview content when implemented */}
                <Card className="card-world-class">
                  <CardContent className="p-8 text-center">
                    <h3 className="font-heading text-2xl font-bold mb-4">Interview In Progress</h3>
                    <p className="text-muted-foreground">Interview functionality will be displayed here.</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          {currentStep === "feedback" && feedbackData && (
            <section className="section-padding fade-in">
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