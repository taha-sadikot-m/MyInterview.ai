import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Send, RotateCcw, Save, Target, CheckCircle, Briefcase, TrendingUp, Award, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Companies categorized for better organization
const COMPANY_CATEGORIES = {
  "IT Services & Consulting": ["TCS", "Infosys", "Wipro", "HCL", "Accenture"],
  "Product & Tech": ["Zoho", "Amazon", "Microsoft", "Google", "Adobe"],
  "Core Engineering": ["L&T", "Bosch", "Hyundai", "Ford", "Ashok Leyland"],
  "Consulting & Finance": ["Deloitte", "KPMG", "EY", "PwC", "Goldman Sachs", "JP Morgan"],
  "Startups & Unicorns": ["Flipkart", "Swiggy", "Zomato", "Freshworks"]
};

const JOB_ROLES = [
  "Software Engineer", "Data Analyst", "Cloud Engineer", "QA Engineer",
  "GET (Core branches)",
  "Consulting Analyst", "Business Analyst"
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

// Sample questions for demo
const SAMPLE_QUESTIONS = [
  "Tell me about yourself and why you're interested in this role.",
  "What are your biggest strengths and how do they apply to this position?",
  "Describe a challenging project you worked on during college.",
  "Why do you want to work at this company specifically?",
  "How do you handle pressure and tight deadlines?",
  "Where do you see yourself in 5 years?"
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
  strengths: string[];
  improvements: string[];
  followUps: string[];
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
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const { toast } = useToast();

  const handleStartInterview = () => {
    if (!interviewData.company || !interviewData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before starting the interview.",
        variant: "destructive"
      });
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

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = [...interviewData.answers];
    newAnswers[interviewData.currentQuestion] = currentAnswer;
    setInterviewData(prev => ({ ...prev, answers: newAnswers }));
    setCurrentAnswer("");

    if (interviewData.currentQuestion + 1 < interviewData.questions.length) {
      setInterviewData(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      handleGenerateFeedback();
    }
  };

  const handleGenerateFeedback = () => {
    setFeedbackLoading(true);
    
    // Simulate feedback generation
    setTimeout(() => {
      const mockFeedback: FeedbackData = {
        overall: "Hire",
        competencies: {
          Communication: 4,
          StructuredThinkingSTAR: 3,
          TechnicalFundamentals: 4,
          ProblemSolving: 3,
          CultureOwnership: 4,
          Coachability: 4
        },
        strengths: [
          "Clear communication style",
          "Good technical understanding",
          "Positive attitude and enthusiasm"
        ],
        improvements: [
          "Use STAR framework for behavioral answers",
          "Provide more specific examples",
          "Practice technical problem-solving"
        ],
        followUps: [
          "Can you walk me through your problem-solving process?",
          "How do you stay updated with industry trends?",
          "Tell me about a time you failed and what you learned."
        ],
        score: 7
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
    setCurrentAnswer("");
    setFeedbackData(null);
  };

  const progress = currentStep === "interview" ? 
    ((interviewData.currentQuestion + 1) / interviewData.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            MyInterview World
          </h1>
          <p className="text-lg font-body text-foreground mb-6">
            Land any job (Fresher).
          </p>
        </div>

        {/* Instructions Panel */}
        <Card className="mb-8 bg-card border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-foreground flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              What you can do here
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 font-body text-foreground">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Select your <strong>Company</strong> and <strong>Role</strong> (Fresher roles only).
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Answer <strong>5–6 role-specific questions</strong> (audio or text).
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Get <strong>recruiter-style feedback</strong> (Hire signal, competency bars, STAR tips).
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Save the attempt to your <strong>Dashboard</strong> and see improvement over time.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 1: Setup */}
        {currentStep === "setup" && (
          <Card className="max-w-2xl mx-auto card-shadow card-hover rounded-2xl">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground font-heading">Choose Your Role</CardTitle>
              <CardDescription className="text-lg font-body text-foreground">
                Select your target company and position for interview practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground font-ui">Company</label>
                <Select value={interviewData.company} onValueChange={(value) => 
                  setInterviewData(prev => ({ ...prev, company: value }))
                }>
                  <SelectTrigger className="w-full">
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
                          <SelectItem key={company} value={company} className="pl-4">
                            {company}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground font-ui">Job Role</label>
                <Select value={interviewData.role} onValueChange={(value) => 
                  setInterviewData(prev => ({ ...prev, role: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground font-ui">Experience Level</label>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge className="bg-primary text-primary-foreground">Fresher (0 years)</Badge>
                  <p className="text-sm text-foreground mt-2 font-body">
                    This page is specifically designed for fresh graduates and entry-level positions.
                  </p>
                </div>
              </div>

              {interviewData.role && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground font-ui">Suggested Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPICS[interviewData.role as keyof typeof SUGGESTED_TOPICS]?.map(topic => (
                      <Badge key={topic} variant="outline" className="text-foreground border-primary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleStartInterview}
                className="w-full bg-primary text-primary-foreground hover:bg-primary-hover py-3 text-lg font-semibold font-ui rounded-xl"
                size="lg"
              >
                Start Interview
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Interview */}
        {currentStep === "interview" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-heading font-bold text-foreground">
                  Question {interviewData.currentQuestion + 1} of {interviewData.questions.length}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 font-ui text-foreground border-secondary"
                >
                  <Volume2 size={16} />
                  <span>Ask Aloud</span>
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Question Panel */}
              <Card className="rounded-2xl card-shadow">
                <CardHeader>
                  <CardTitle className="font-heading text-foreground">Interview Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 rounded-lg border">
                    <p className="text-lg font-medium text-foreground font-body">
                      {interviewData.questions[interviewData.currentQuestion]}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-foreground font-body">
                    Take your time to think through your answer. You can respond via text or audio recording.
                  </div>
                </CardContent>
              </Card>

              {/* Answer Panel */}
              <Card className="rounded-2xl card-shadow">
                <CardHeader>
                  <CardTitle className="font-heading text-foreground">Your Answer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[200px] text-foreground"
                  />
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`flex items-center space-x-2 font-ui ${isRecording ? 'text-red-600 border-red-300' : 'text-foreground border-secondary'}`}
                    >
                      <Mic size={16} />
                      <span>{isRecording ? 'Stop Recording' : 'Record Audio'}</span>
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitAnswer}
                      className="bg-primary text-primary-foreground hover:bg-primary-hover font-ui rounded-xl"
                    >
                      <Send size={16} className="mr-2" />
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Feedback */}
        {currentStep === "feedback" && feedbackData && (
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="rounded-2xl card-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-heading text-foreground">Interview Feedback</CardTitle>
                <CardDescription className="text-lg font-body text-foreground">
                  Recruiter-style evaluation and actionable insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Overall Recommendation */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-ui font-semibold text-foreground">Recommendation: {feedbackData.overall}</span>
                  </div>
                  <p className="text-sm text-foreground mt-2 font-body">Score: {feedbackData.score}/10</p>
                </div>

                {/* Competencies */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4">Competency Scores</h3>
                    <div className="space-y-3">
                      {Object.entries(feedbackData.competencies).map(([skill, score]) => (
                        <div key={skill} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-ui text-foreground">{skill}</span>
                            <span className="text-sm font-ui text-foreground">{score}/5</span>
                          </div>
                          <Progress value={(score / 5) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4">Key Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-ui font-semibold text-foreground text-sm mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {feedbackData.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-foreground font-body flex items-start">
                              <CheckCircle className="w-3 h-3 mt-0.5 mr-2 text-primary flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-ui font-semibold text-foreground text-sm mb-2">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {feedbackData.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-foreground font-body flex items-start">
                              <Target className="w-3 h-3 mt-0.5 mr-2 text-secondary flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow-up Questions */}
                <div className="mb-8">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-4">Follow-up Questions for Next Time</h3>
                  <div className="grid md:grid-cols-1 gap-3">
                    {feedbackData.followUps.map((question, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground font-body">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={resetInterview}
                    variant="outline"
                    className="font-ui text-foreground border-secondary hover:bg-secondary/10 rounded-xl"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Try Another Interview
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary-hover font-ui rounded-xl">
                    <Save size={16} className="mr-2" />
                    Save to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {feedbackLoading && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="rounded-2xl card-shadow">
              <CardContent className="py-12">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  Generating Recruiter Feedback...
                </h3>
                <p className="text-foreground font-body">
                  Our AI recruiter is analyzing your responses and preparing detailed feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviewWorld;