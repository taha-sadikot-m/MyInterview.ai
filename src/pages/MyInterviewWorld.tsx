import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { JudgePanel } from "@/components/JudgePanel";
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
  RotateCcw
} from "lucide-react";

// Mock data
const COMPANY_CATEGORIES = {
  "IT Services & Consulting": ["TCS", "Infosys", "Wipro", "HCL", "Accenture"],
  "Product & Tech": ["Zoho", "Amazon", "Microsoft", "Google", "Adobe"],
  "Core Engineering": ["L&T", "Bosch", "Hyundai", "Ford", "Ashok Leyland"],
  "Consulting & Finance": ["Deloitte", "KPMG", "EY", "PwC", "Goldman Sachs", "JP Morgan"],
  "Startups & Unicorns": ["Flipkart", "Swiggy", "Zomato", "Freshworks"]
};

const JOB_ROLES = [
  "Software Engineer", 
  "Data Analyst", 
  "Cloud Engineer", 
  "QA Engineer",
  "GET (Core branches)",
  "Consulting Analyst", 
  "Business Analyst"
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

type Step = "setup" | "interview" | "feedback";

interface InterviewData {
  company: string;
  role: string;
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
    role: "",
    questions: [],
    answers: [],
    currentQuestion: 0
  });
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleStartInterview = () => {
    if (!interviewData.company || !interviewData.role) {
      return;
    }

    setInterviewData(prev => ({
      ...prev,
      questions: SAMPLE_QUESTIONS,
      answers: new Array(SAMPLE_QUESTIONS.length).fill(""),
      currentQuestion: 0
    }));
    setCurrentStep("interview");
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
      <section className="hero-indigo section-padding">
        <div className="section-content text-center relative z-10">
          <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6">
            Interview World — Let the Dream Job Land on You!
          </h1>
          <p className="font-tagline text-2xl md:text-3xl text-white/95 mb-12">
            Voice-only mock interviews with recruiter-style feedback.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <Button 
              onClick={() => setCurrentStep('setup')}
              className="btn-indigo min-w-[280px] h-16 text-lg"
            >
              <Briefcase className="w-6 h-6 mr-3" />
              Start Mock Interview
            </Button>
            
            <Button 
              className="btn-outline-indigo min-w-[280px] h-16 text-lg"
            >
              <Target className="w-6 h-6 mr-3" />
              Choose Role & Company
            </Button>
            
            <Button 
              className="btn-outline-indigo min-w-[280px] h-16 text-lg"
            >
              <TrendingUp className="w-6 h-6 mr-3" />
              View Progress
            </Button>
          </div>

          <div className="mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full text-white backdrop-blur-sm">
              <Briefcase className="w-5 h-5 mr-2" />
              <span className="font-ui font-semibold">For Fresh Graduates & Entry-Level Roles</span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-content">
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

                <div className="text-center">
                  <Button 
                    onClick={handleStartInterview}
                    disabled={!interviewData.company || !interviewData.role}
                    className="btn-indigo min-w-[320px] h-16 text-lg"
                  >
                    <Briefcase className="w-6 h-6 mr-3" />
                    Start Interview Practice
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
      </div>
    </div>
  );
};

export default MyInterviewWorld;