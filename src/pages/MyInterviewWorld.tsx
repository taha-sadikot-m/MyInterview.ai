import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Send, RotateCcw, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fresher-focused question bank for different roles
const QUESTION_BANK = {
  "Software Engineer": [
    "Explain time vs space complexity with a simple example.",
    "What is the difference between a process and a thread?",
    "SQL: Write a query to fetch the second highest salary.",
    "How would you debug a program that fails only on edge cases?",
    "Describe a project you built and your exact contribution."
  ],
  "Data Analyst": [
    "Difference between JOIN and UNION with examples.",
    "Explain p-value to a non-technical stakeholder.",
    "How would you handle missing values in a dataset?",
    "SQL: Find the top 3 performing products per region.",
    "How would you explain insights from data to a CEO in 2 minutes?"
  ],
  "Cloud Engineer": [
    "Explain VPC, Subnet, and Security Groups in simple terms.",
    "Design a highly available web app on cloud—what components?",
    "Blue/Green vs Rolling deployments—when to use which?",
    "Two ways to reduce cloud costs without hurting reliability?",
    "Outline a basic CI/CD pipeline for a containerized app."
  ],
  "QA Engineer": [
    "Write test cases for a login page (happy & edge paths).",
    "Smoke vs regression testing—explain with examples.",
    "What is boundary value analysis and where would you use it?",
    "How do you prioritize bugs when deadlines are tight?",
    "Approach to automate tests for a web app from scratch?"
  ],
  "GET (Mechanical / Civil / EEE / Automobile)": [
    "Thermodynamics/Bernoulli—explain a concept and application.",
    "List common manufacturing processes and where they fit.",
    "How do you estimate load-bearing capacity of a column?",
    "Why did you choose your core branch and not IT?",
    "One improvement you would make to a production line and why."
  ],
  "Consulting Analyst": [
    "Guesstimate: Daily Uber rides in Chennai—walk through structure.",
    "Tell me about solving a problem with incomplete data.",
    "How would you persuade a client to adopt a digital solution?",
    "Describe a team conflict and how you handled it.",
    "Why consulting, and why this company?"
  ],
  "Business Analyst": [
    "Improve user retention for a delivery app—top 3 hypotheses.",
    "Which metrics matter most for a new product launch and why?",
    "How do you manage conflicting stakeholder priorities?",
    "Design a simple ops dashboard for a city manager.",
    "Give a 30-second pitch for your favourite product and why."
  ]
};

const COMPANY_CATEGORIES = {
  "IT Services & Consulting": ["TCS", "Infosys", "Wipro", "HCL", "Accenture"],
  "Product & Tech": ["Zoho", "Amazon", "Microsoft", "Google", "Adobe"],
  "Core Engineering": ["L&T", "Bosch", "Hyundai", "Ford", "Ashok Leyland"],
  "Consulting & Finance": ["Deloitte", "KPMG", "EY", "PwC", "Goldman Sachs", "JP Morgan"],
  "Startups & Unicorns": ["Flipkart", "Swiggy", "Zomato", "Freshworks"]
};

const JOB_ROLES = [
  "Software Engineer", "Data Analyst", "Cloud Engineer", "QA Engineer",
  "GET (Mechanical / Civil / EEE / Automobile)",
  "Consulting Analyst", "Risk Advisory Analyst", "Tech Analyst",
  "Business Analyst", "Product Intern", "Sales/BD Associate"
];

const EXPERIENCE_LEVELS = ["Fresher (0 years)"];

const SUGGESTED_TOPICS = {
  "Software Engineer": ["DSA", "OOP", "SQL", "REST APIs", "Problem Solving", "Behavioural"],
  "Data Analyst": ["SQL", "Excel", "Statistics", "Data Visualization", "Communication", "Behavioural"],
  "Cloud Engineer": ["AWS", "Docker", "CI/CD", "DevOps", "Networking", "Problem Solving"],
  "QA Engineer": ["Testing", "Automation", "SDLC", "Bug Tracking", "Communication", "Behavioural"],
  "GET (Mechanical / Civil / EEE / Automobile)": ["Core Engineering", "Manufacturing", "CAD", "Problem Solving", "Communication", "Behavioural"],
  "Consulting Analyst": ["Case Studies", "Guesstimates", "Problem Solving", "Communication", "Presentation", "Behavioural"],
  "Business Analyst": ["Business Strategy", "Data Analysis", "Stakeholder Management", "Communication", "Problem Solving", "Behavioural"]
};

type Step = "setup" | "interview" | "feedback";

interface InterviewData {
  company: string;
  role: string;
  experience: string;
  questions: string[];
  answers: string[];
  currentQuestion: number;
}

const MyInterviewWorld = () => {
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [interviewData, setInterviewData] = useState<InterviewData>({
    company: "",
    role: "",
    experience: "",
    questions: [],
    answers: [],
    currentQuestion: 0
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const { toast } = useToast();

  const handleStartInterview = () => {
    if (!interviewData.company || !interviewData.role || !interviewData.experience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before starting the interview.",
        variant: "destructive"
      });
      return;
    }

    const questions = QUESTION_BANK[interviewData.role as keyof typeof QUESTION_BANK] || [];
    setInterviewData(prev => ({
      ...prev,
      questions: questions.slice(0, 7),
      answers: new Array(7).fill("")
    }));
    setCurrentStep("interview");
    toast({
      title: "Interview Started!",
      description: "Good luck with your practice session."
    });
  };

  const handleAnswerSubmit = () => {
    const newAnswers = [...interviewData.answers];
    newAnswers[interviewData.currentQuestion] = currentAnswer;
    setInterviewData(prev => ({
      ...prev,
      answers: newAnswers
    }));
    setCurrentAnswer("");

    if (interviewData.currentQuestion < interviewData.questions.length - 1) {
      setInterviewData(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      toast({
        title: `Question ${interviewData.currentQuestion + 2}/${interviewData.questions.length}`,
        description: "Next question loaded."
      });
    } else {
      setCurrentStep("feedback");
      toast({
        title: "Interview Complete!",
        description: "Generating your feedback..."
      });
    }
  };

  const handleSpeakQuestion = () => {
    if (aiMode) {
      toast({
        title: "AI TTS Feature",
        description: "Connect to Supabase to enable AI-powered text-to-speech."
      });
    } else {
      const currentQuestion = interviewData.questions[interviewData.currentQuestion];
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentQuestion);
        speechSynthesis.speak(utterance);
      } else {
        toast({
          title: "Speech Not Supported",
          description: "Your browser doesn't support text-to-speech."
        });
      }
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Audio recording feature requires Supabase integration."
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Audio recording feature requires Supabase integration."
      });
    }
  };

  const resetInterview = () => {
    setCurrentStep("setup");
    setInterviewData({
      company: "",
      role: "",
      experience: "",
      questions: [],
      answers: [],
      currentQuestion: 0
    });
    setCurrentAnswer("");
  };

  const progress = currentStep === "interview" ? 
    ((interviewData.currentQuestion + 1) / interviewData.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            MyInterview World
          </h1>
          <p className="text-xl font-body italic text-white/90 mb-4">
            Prepare. Practice. Perform.
          </p>
          <p className="text-lg font-body text-white/80 max-w-2xl mx-auto">
            Simulate real campus interviews as a Fresher and get recruiter-style feedback.
          </p>
        </div>
      </section>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-ui">M</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-900 font-heading">MyDebate.ai</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium font-ui">AI Mode</span>
                <Button
                  variant={aiMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAiMode(!aiMode)}
                  className="font-ui"
                >
                  {aiMode ? "AI" : "Free"}
                </Button>
              </div>
              {currentStep === "interview" && (
                <div className="text-sm font-medium font-ui text-primary">
                  Question {interviewData.currentQuestion + 1}/{interviewData.questions.length}
                </div>
              )}
            </div>
          </div>
          {currentStep === "interview" && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Step 1: Setup */}
        {currentStep === "setup" && (
          <Card className="max-w-2xl mx-auto card-shadow card-hover rounded-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 font-heading">Choose Your Role</CardTitle>
              <CardDescription className="text-lg font-body">
                Select your target company and position for interview practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-ui">Company</label>
                <Select value={interviewData.company} onValueChange={(value) => 
                  setInterviewData(prev => ({ ...prev, company: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPANY_CATEGORIES).map(([category, companies]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground font-ui">
                          {category}
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
                <label className="text-sm font-medium text-gray-700 font-ui">Job Role</label>
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
                <label className="text-sm font-medium text-gray-700 font-ui">Experience Level</label>
                <Select value={interviewData.experience} onValueChange={(value) => 
                  setInterviewData(prev => ({ ...prev, experience: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {interviewData.role && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-ui">Suggested Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPICS[interviewData.role as keyof typeof SUGGESTED_TOPICS]?.map(topic => (
                      <Badge key={topic} variant="secondary" className="bg-accent/10 text-accent font-ui">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleStartInterview}
                className="w-full button-gradient text-white py-3 text-lg font-semibold font-ui rounded-xl"
                size="lg"
              >
                Start Interview
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Interview */}
        {currentStep === "interview" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Question Panel */}
            <Card className="rounded-xl card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-heading">
                  <span>Interview Question</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpeakQuestion}
                    className="flex items-center space-x-2 font-ui"
                  >
                    <Volume2 size={16} />
                    <span>Ask Aloud</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <p className="text-lg font-medium text-gray-900 font-body">
                    {interviewData.questions[interviewData.currentQuestion]}
                  </p>
                </div>
                <div className="mt-4 text-sm text-gray-600 font-body">
                  Take your time to think through your answer. You can respond via text or audio recording.
                </div>
              </CardContent>
            </Card>

            {/* Answer Panel */}
            <Card className="rounded-xl card-shadow">
              <CardHeader>
                <CardTitle className="font-heading">Your Answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={handleRecordToggle}
                      className="flex items-center space-x-2 font-ui"
                    >
                      <Mic size={16} />
                      <span>{isRecording ? "Stop Recording" : "Record Audio"}</span>
                    </Button>
                    
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={!currentAnswer.trim()}
                      className="flex items-center space-x-2 button-gradient font-ui rounded-xl"
                    >
                      <Send size={16} />
                      <span>Submit Answer</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Feedback */}
        {currentStep === "feedback" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="rounded-xl card-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 font-heading">Interview Feedback</CardTitle>
                <CardDescription className="text-lg font-body">
                  AI-powered analysis of your interview performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="text-center bg-success/10 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-success mb-2 font-heading">8.5/10</div>
                  <div className="text-lg text-gray-700 font-body">Overall Interview Score</div>
                </div>

                {/* Rubric Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Strengths</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-success">✓</span>
                        <span className="font-body">Clear and structured responses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-success">✓</span>
                        <span className="font-body">Good technical knowledge demonstrated</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-success">✓</span>
                        <span className="font-body">Confident delivery and communication</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-500">→</span>
                        <span className="font-body">Provide more concrete examples</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-500">→</span>
                        <span className="font-body">Elaborate on problem-solving approach</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-500">→</span>
                        <span className="font-body">Ask clarifying questions when needed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Practice Tips</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2 text-blue-800 font-body">
                      <li>• Practice explaining technical concepts in simple terms</li>
                      <li>• Prepare STAR method examples for behavioral questions</li>
                      <li>• Research the company's recent projects and technologies</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-6">
                  <Button variant="outline" onClick={resetInterview} className="flex items-center space-x-2 font-ui">
                    <ArrowLeft size={16} />
                    <span>Back to Roles</span>
                  </Button>
                  <Button className="flex items-center space-x-2 button-gradient font-ui rounded-xl">
                    <Save size={16} />
                    <span>Save Attempt</span>
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep("interview")} className="flex items-center space-x-2 font-ui">
                    <RotateCcw size={16} />
                    <span>Try Again</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 text-gray-600 font-ui">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyInterviewWorld;