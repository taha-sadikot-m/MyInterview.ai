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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 pt-20 pb-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-baloo font-bold text-white mb-6">
            Interview World
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 font-inter max-w-3xl mx-auto">
            Prepare, Practice & Perform — Land your dream job with AI-powered interview coaching
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full text-white backdrop-blur-sm">
            <Briefcase className="w-5 h-5 mr-2" />
            <span className="font-poppins font-semibold">For Fresh Graduates & Entry-Level Roles</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-12 relative z-10">

        {/* Instructions Panel */}
        <Card className="mb-12 bg-white shadow-xl rounded-3xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <CardTitle className="text-2xl font-baloo font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-3" />
              How Interview World Works
            </CardTitle>
          </div>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-poppins font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-900 mb-1">Choose Your Target</h4>
                    <p className="text-gray-600 font-inter">Select your dream company and role from top recruiters</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-poppins font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-900 mb-1">Practice Real Questions</h4>
                    <p className="text-gray-600 font-inter">Answer 5-6 role-specific questions via text or voice</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-poppins font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-900 mb-1">Get Expert Feedback</h4>
                    <p className="text-gray-600 font-inter">Receive recruiter-style evaluation with competency scores</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-poppins font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-900 mb-1">Track Progress</h4>
                    <p className="text-gray-600 font-inter">Save attempts and monitor improvement over time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Setup */}
        {currentStep === "setup" && (
          <Card className="max-w-3xl mx-auto shadow-2xl rounded-3xl border-0 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-4xl font-baloo font-bold text-white mb-4">Choose Your Target Role</CardTitle>
              <CardDescription className="text-xl text-indigo-100 font-inter">
                Select your dream company and position to start practicing
              </CardDescription>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-lg font-poppins font-semibold text-gray-900">Target Company</label>
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

              <div className="space-y-3">
                <label className="text-lg font-poppins font-semibold text-gray-900">Job Role</label>
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

              <div className="space-y-3">
                <label className="text-lg font-poppins font-semibold text-gray-900">Experience Level</label>
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 text-sm font-poppins">
                    Fresher (0 years)
                  </Badge>
                  <p className="text-gray-700 mt-3 font-inter">
                    Designed specifically for fresh graduates and entry-level positions at top companies.
                  </p>
                </div>
              </div>

              {interviewData.role && (
                <div className="space-y-3">
                  <label className="text-lg font-poppins font-semibold text-gray-900">Topics You'll Practice</label>
                  <div className="flex flex-wrap gap-3">
                    {SUGGESTED_TOPICS[interviewData.role as keyof typeof SUGGESTED_TOPICS]?.map(topic => (
                      <Badge key={topic} className="bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 font-poppins">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleStartInterview}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-6 text-xl font-poppins font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                size="lg"
              >
                🎤 Start Interview Practice
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Interview */}
        {currentStep === "interview" && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-baloo font-bold text-gray-900 mb-2">
                    Question {interviewData.currentQuestion + 1} of {interviewData.questions.length}
                  </h2>
                  <p className="text-gray-600 font-inter">Take your time and answer confidently</p>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 px-6 py-3 rounded-2xl font-poppins font-semibold"
                >
                  <Volume2 size={20} />
                  <span>Ask Aloud</span>
                </Button>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-gray-200 rounded-full overflow-hidden" />
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Question Panel */}
              <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                  <CardTitle className="text-2xl font-baloo font-bold text-white">Interview Question</CardTitle>
                </div>
                <CardContent className="p-8">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                    <p className="text-xl font-inter text-gray-900 leading-relaxed">
                      {interviewData.questions[interviewData.currentQuestion]}
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-blue-800 font-inter">
                      💡 <strong>Tip:</strong> Structure your answer using the STAR method (Situation, Task, Action, Result) for behavioral questions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Panel */}
              <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                  <CardTitle className="text-2xl font-baloo font-bold text-white">Your Answer</CardTitle>
                </div>
                <CardContent className="p-8 space-y-6">
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here or use voice recording below..."
                    className="min-h-[250px] text-gray-900 border-gray-200 rounded-2xl font-inter text-lg p-6 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-poppins font-semibold transition-all ${
                        isRecording 
                          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' 
                          : 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      <Mic size={20} />
                      <span>{isRecording ? '⏹️ Stop Recording' : '🎙️ Record Audio'}</span>
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitAnswer}
                      className="flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-poppins font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex-1"
                    >
                      <Send size={20} />
                      <span>Submit Answer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Feedback */}
        {currentStep === "feedback" && feedbackData && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-4xl font-baloo font-bold text-white mb-4">Interview Complete! 🎉</CardTitle>
                <CardDescription className="text-xl text-indigo-100 font-inter">
                  Here's your recruiter-style evaluation and actionable feedback
                </CardDescription>
              </div>
              <CardContent className="p-8">
                {/* Overall Recommendation */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl border border-emerald-300">
                    <TrendingUp className="w-6 h-6 text-emerald-700" />
                    <span className="font-poppins font-bold text-xl text-emerald-800">
                      Recommendation: {feedbackData.overall}
                    </span>
                  </div>
                  <div className="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-indigo-100 rounded-2xl">
                    <span className="text-2xl">🎯</span>
                    <span className="font-inter font-semibold text-indigo-800 text-lg">
                      Overall Score: {feedbackData.score}/10
                    </span>
                  </div>
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
                <div className="mb-10">
                  <h3 className="text-2xl font-baloo font-bold text-gray-900 mb-6 flex items-center">
                    🤔 Practice These Next Time
                  </h3>
                  <div className="grid gap-4">
                    {feedbackData.followUps.map((question, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <p className="font-inter text-blue-800 text-lg leading-relaxed">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    onClick={resetInterview}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-poppins font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                  >
                    <RotateCcw size={20} className="mr-3" />
                    Try Another Interview
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-poppins font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all">
                    <Save size={20} className="mr-3" />
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
            <Card className="bg-white rounded-3xl shadow-xl border-0">
              <CardContent className="py-16">
                <div className="relative mx-auto mb-8 w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-2xl font-baloo font-bold text-gray-900 mb-4">
                  🤖 AI Recruiter Analyzing...
                </h3>
                <p className="text-gray-600 font-inter text-lg">
                  Evaluating your answers and preparing detailed feedback
                </p>
                <div className="mt-6 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviewWorld;