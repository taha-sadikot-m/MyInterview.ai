import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Send, RotateCcw, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Question bank for different roles
const QUESTION_BANK = {
  "SDE Intern": [
    "Explain time vs space complexity with an example.",
    "How would you design a URL shortener?",
    "What's the difference between process and thread?",
    "How do you handle nulls in your code defensively?",
    "Describe a bug you fixed and how you diagnosed it."
  ],
  "Frontend Developer": [
    "How do you optimize a React app for performance?",
    "Explain the virtual DOM and reconciliation.",
    "When do you debounce vs throttle?",
    "How would you design a responsive grid system?",
    "What's your approach to accessibility (a11y)?"
  ],
  "Data Analyst": [
    "SQL: Find top 3 categories by revenue per month.",
    "Difference between LEFT JOIN and UNION with examples.",
    "How do you handle missing values?",
    "Explain p-value to a non-technical stakeholder.",
    "Design a dashboard for campus placement KPIs."
  ],
  "QA Engineer": [
    "How do you write test cases for a login page?",
    "Explain smoke vs regression testing.",
    "What's boundary value analysis?",
    "How do you prioritize bugs?",
    "How do you automate tests for a web app?"
  ],
  "Product Manager": [
    "Write a PRD outline for a campus recruitment portal.",
    "How do you define and track success metrics?",
    "Trade-off decision you made and why.",
    "How do you run user interviews effectively?",
    "Prioritize 5 features for MVP and justify."
  ],
  "Cloud Engineer": [
    "Explain VPC, Subnet, Security Group basics.",
    "How do you design HA & auto-scaling for a web app?",
    "Blue/Green vs Rolling deployments?",
    "Cost optimization strategies on AWS?",
    "CI/CD pipeline for a containerized app."
  ]
};

const COMPANIES = ["TCS", "Infosys", "Accenture", "Wipro", "HCL", "Amazon", "Zoho"];
const JOB_ROLES = ["SDE Intern", "Frontend Developer", "Data Analyst", "QA Engineer", "Product Manager", "Cloud Engineer"];
const EXPERIENCE_LEVELS = ["Fresher", "0-1 years", "1-2 years", "2-3 years"];

const SUGGESTED_TOPICS = {
  "SDE Intern": ["DSA", "OOP", "Algorithms", "Data Structures", "Problem Solving"],
  "Frontend Developer": ["React", "JavaScript", "CSS", "HTML", "Performance"],
  "Data Analyst": ["SQL", "Excel", "Statistics", "Data Visualization", "Python"],
  "QA Engineer": ["Testing", "Automation", "SDLC", "Bug Tracking", "Test Cases"],
  "Product Manager": ["Product Strategy", "User Research", "Metrics", "Roadmapping", "Stakeholder Management"],
  "Cloud Engineer": ["AWS", "Docker", "Kubernetes", "DevOps", "Infrastructure"]
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
    <div className="min-h-screen" style={{
      background: "linear-gradient(to bottom, #00C853 0%, #FFFFFF 50%, #000000 100%)"
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-heading">MyInterview World</h1>
                <p className="text-sm text-gray-600 font-body italic">Prepare. Practice. Perform.</p>
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
                <div className="text-sm font-medium font-ui">
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
                    {COMPANIES.map(company => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
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
                      <Badge key={topic} variant="secondary" className="bg-green-100 text-green-800">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleStartInterview}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold font-ui"
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
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 font-ui"
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
                <div className="text-center bg-green-50 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2 font-heading">8.5/10</div>
                  <div className="text-lg text-gray-700 font-body">Overall Interview Score</div>
                </div>

                {/* Rubric Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Strengths</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="font-body">Clear and structured responses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="font-body">Good technical knowledge demonstrated</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">✓</span>
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
                  <Button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 font-ui">
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
          <div className="flex justify-center space-x-8 text-gray-600">
            <a href="#" className="hover:text-green-600 transition-colors">About</a>
            <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
            <a href="#" className="hover:text-green-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyInterviewWorld;