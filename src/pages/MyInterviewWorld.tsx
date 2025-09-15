import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Send, RotateCcw, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Comprehensive company-role based question bank for freshers
const COMPANY_ROLE_QUESTIONS = {
  "TCS": {
    "Software Engineer": [
      "Explain OOPS concepts with examples.",
      "What is the difference between C and Java?",
      "Write a SQL query to get the top 3 salaries.",
      "What is normalization in databases?",
      "Tell me about yourself in detail.",
      "Explain Agile methodology in simple words.",
      "What is the difference between REST and SOAP APIs?"
    ]
  },
  "Infosys": {
    "Software Engineer": [
      "What are the four pillars of OOPS?",
      "Explain SDLC phases.",
      "How is Python different from Java?",
      "Explain primary key vs foreign key.",
      "Where do you see yourself in 5 years?",
      "Explain microservices architecture.",
      "What are the key benefits of DevOps?"
    ],
    "Data Analyst": [
      "Difference between machine learning and deep learning?",
      "How would you design a login system?",
      "Why Infosys Digital over System Engineer?",
      "What is data normalization?",
      "Explain SQL vs NoSQL databases.",
      "How do you handle missing data in analysis?",
      "What is the difference between correlation and causation?"
    ]
  },
  "Wipro": {
    "Software Engineer": [
      "What is encapsulation in OOPS?",
      "Explain deadlock with example.",
      "What are joins in SQL? Give examples.",
      "How do you handle pressure situations?",
      "Why do you want to work at Wipro?",
      "What is polymorphism in programming?",
      "Explain the concept of inheritance."
    ]
  },
  "HCL": {
    "Software Engineer": [
      "Explain polymorphism with an example.",
      "What is multithreading?",
      "What is the use of indexes in databases?",
      "Tell me about a challenge you faced in college.",
      "Why should we hire you as a fresher?",
      "What is abstraction in OOPS?",
      "How do you debug a program?"
    ]
  },
  "Accenture": {
    "Software Engineer": [
      "What is cloud computing? Types of cloud?",
      "Explain SDLC Agile vs Waterfall.",
      "What are functional and non-functional requirements?",
      "Give an example of teamwork from college.",
      "Why Accenture and not other IT companies?",
      "What is API and how does it work?",
      "Explain the concept of version control."
    ]
  },
  "Zoho": {
    "Software Engineer": [
      "Explain difference between array and linked list.",
      "Write a program to reverse a string.",
      "What is recursion? Give an example.",
      "Explain TCP vs UDP.",
      "Why Zoho as your career choice?",
      "What is a binary tree?",
      "How do you optimize code performance?"
    ]
  },
  "Amazon": {
    "Software Engineer": [
      "Explain Big-O notation with example.",
      "How would you design an elevator system?",
      "SQL: Get customers who ordered more than 3 times in a month.",
      "What is Amazon's Leadership Principle you relate with?",
      "Tell me about a time you solved a tough problem.",
      "What is dynamic programming?",
      "How do you handle system scalability?"
    ]
  },
  "Microsoft": {
    "Software Engineer": [
      "What happens when you type a URL in a browser?",
      "Explain garbage collection in Java or C#.",
      "Design a data structure for an LRU cache.",
      "What is polymorphism?",
      "Why do you want to join Microsoft?",
      "What is dependency injection?",
      "How do you ensure code quality?"
    ]
  },
  "Google": {
    "Software Engineer": [
      "Explain MapReduce in simple words.",
      "Design a system like Google Docs (collaborative editor).",
      "How would you detect spam emails?",
      "Explain difference between supervised vs unsupervised ML.",
      "What motivates you to join Google?",
      "What is distributed computing?",
      "How do you handle large datasets?"
    ]
  },
  "Adobe": {
    "Software Engineer": [
      "What is inheritance in OOPS?",
      "Explain MVC architecture.",
      "How do you handle memory leaks?",
      "What is a hash table and where is it used?",
      "Why Adobe over other product companies?",
      "What is event-driven programming?",
      "How do you optimize user interfaces?"
    ]
  },
  "L&T": {
    "GET (Mechanical / Civil / EEE / Automobile)": [
      "Explain stress vs strain with example.",
      "What is shear force and bending moment?",
      "Difference between RCC and PCC?",
      "Tell me about a construction project you worked on.",
      "Why do you want to join L&T?",
      "What is project management?",
      "How do you ensure safety in construction?"
    ]
  },
  "Bosch": {
    "GET (Mechanical / Civil / EEE / Automobile)": [
      "Explain IC engine working.",
      "What is Six Sigma?",
      "What are different welding methods?",
      "Tell me about your final year project.",
      "Why Bosch as your first employer?",
      "What is lean manufacturing?",
      "How do you reduce production costs?"
    ]
  },
  "Hyundai": {
    "GET (Mechanical / Civil / EEE / Automobile)": [
      "Explain thermodynamics laws in automobiles.",
      "Difference between diesel and petrol engine?",
      "How do you test vehicle safety?",
      "What is lean manufacturing?",
      "Why Hyundai and not another automobile company?",
      "What is automotive electronics?",
      "How do you improve fuel efficiency?"
    ]
  },
  "Ford": {
    "GET (Mechanical / Civil / EEE / Automobile)": [
      "What is ABS and how does it work?",
      "Explain supply chain process for automobiles.",
      "What is Kaizen?",
      "Describe a teamwork experience in college.",
      "Why Ford Motors?",
      "What is quality control in manufacturing?",
      "How do you handle production deadlines?"
    ]
  },
  "Ashok Leyland": {
    "GET (Mechanical / Civil / EEE / Automobile)": [
      "Explain suspension system basics.",
      "What are emission norms (BS6)?",
      "What is difference between torque and power?",
      "How do you reduce production defects?",
      "Why Ashok Leyland?",
      "What is preventive maintenance?",
      "How do you optimize vehicle design?"
    ]
  },
  "Deloitte": {
    "Consulting Analyst": [
      "Explain SWOT analysis.",
      "What are KPIs in consulting?",
      "Tell me about a time you solved a problem with incomplete data.",
      "How do you handle deadlines?",
      "Why Deloitte?",
      "What is business process improvement?",
      "How do you manage client expectations?"
    ]
  },
  "KPMG": {
    "Consulting Analyst": [
      "What is difference between audit and assurance?",
      "What is risk-based auditing?",
      "How do you prioritize client requirements?",
      "Give an example of critical thinking you used.",
      "Why KPMG?",
      "What is financial analysis?",
      "How do you present findings to clients?"
    ]
  },
  "EY": {
    "Consulting Analyst": [
      "What is financial due diligence?",
      "How do you deal with data inconsistencies?",
      "Explain stakeholder management with example.",
      "What is your strength that fits EY?",
      "Why EY?",
      "What is change management?",
      "How do you handle confidential information?"
    ]
  },
  "PwC": {
    "Consulting Analyst": [
      "What is digital transformation?",
      "How would you analyze a failing business unit?",
      "Tell me about a leadership role in college.",
      "What is one weakness you are improving?",
      "Why PwC?",
      "What is strategic planning?",
      "How do you work with diverse teams?"
    ]
  },
  "Goldman Sachs": {
    "Business Analyst": [
      "Explain derivatives in simple words.",
      "What is difference between equity and debt?",
      "SQL: How do you find duplicate records?",
      "How do you manage stress?",
      "Why Goldman Sachs?",
      "What is financial modeling?",
      "How do you analyze market trends?"
    ]
  },
  "JP Morgan": {
    "Business Analyst": [
      "What is investment banking in simple words?",
      "Explain DB transaction ACID properties.",
      "Tell me about an Excel formula you use often.",
      "How do you prioritize tasks?",
      "Why JP Morgan?",
      "What is risk assessment?",
      "How do you handle large datasets in Excel?"
    ]
  },
  "Flipkart": {
    "Business Analyst": [
      "How would you improve Flipkart's checkout process?",
      "What metrics matter most in e-commerce?",
      "Explain recommendation systems briefly.",
      "Tell me about a time you handled data ambiguity.",
      "Why Flipkart?",
      "What is A/B testing?",
      "How do you measure customer satisfaction?"
    ]
  },
  "Swiggy": {
    "Business Analyst": [
      "What metrics track food delivery efficiency?",
      "How would you reduce late deliveries?",
      "Design a dashboard for Swiggy operations.",
      "What is your favorite feature of Swiggy and why?",
      "Why Swiggy?",
      "What is demand forecasting?",
      "How do you optimize delivery routes?"
    ]
  },
  "Zomato": {
    "Business Analyst": [
      "How would you improve Zomato Gold?",
      "Which metrics show restaurant partner success?",
      "Design a simple dashboard for restaurant ratings.",
      "What motivates you in the food-tech sector?",
      "Why Zomato?",
      "What is customer retention strategy?",
      "How do you analyze user behavior?"
    ]
  },
  "Freshworks": {
    "Sales/BD Associate": [
      "How would you pitch Freshworks CRM to a small business?",
      "What are the key challenges in SaaS sales?",
      "Tell me about a time you convinced someone.",
      "How do you handle rejection?",
      "Why Freshworks?",
      "What is customer lifecycle management?",
      "How do you build client relationships?"
    ]
  }
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

    const companyQuestions = COMPANY_ROLE_QUESTIONS[interviewData.company as keyof typeof COMPANY_ROLE_QUESTIONS];
    const questions = companyQuestions?.[interviewData.role as keyof typeof companyQuestions] as string[] || [];
    
    if (questions.length === 0) {
      toast({
        title: "No Questions Available",
        description: "No questions found for this company-role combination.",
        variant: "destructive"
      });
      return;
    }
    
    setInterviewData(prev => ({
      ...prev,
      questions: questions.slice(0, 7),
      answers: new Array(Math.min(7, questions.length)).fill("")
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