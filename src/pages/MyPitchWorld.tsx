import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Send, RotateCcw, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Stage-specific question bank for investor pitches
const PITCH_QUESTIONS = {
  "Pre-Seed": {
    "EdTech": [
      "What problem are you solving in education?",
      "Who is your first target customer?",
      "How will you validate demand in the next 6 months?",
      "What does MVP success look like for you?",
      "Why are you uniquely suited to solve this?"
    ],
    "FinTech": [
      "What is the pain point in financial services you address?",
      "How do you plan to navigate regulatory hurdles?",
      "How will you gain initial user trust?",
      "What is your minimum viable product for Pre-Seed?",
      "What differentiates you from traditional banks?"
    ],
    "HealthTech": [
      "What clinical or health outcome are you improving?",
      "How will you validate safety and compliance?",
      "What regulatory approvals do you need first?",
      "Who is your first customer—patient, hospital, or insurer?",
      "Why is this the right time for your startup?"
    ],
    "Consumer": [
      "What daily habit or need are you targeting?",
      "Why will consumers switch to your product?",
      "How will you reach your first 1,000 users?",
      "How are you funding initial production/distribution?",
      "What makes your product stand out?"
    ],
    "SaaS": [
      "What workflow inefficiency are you solving?",
      "Who is the first team or department you will sell to?",
      "How will you onboard early customers?",
      "What is your basic revenue model?",
      "How will you prove retention and stickiness?"
    ],
    "Climate": [
      "What environmental problem are you solving?",
      "How measurable is your impact?",
      "What is the first pilot or deployment?",
      "How will you attract partners and policy support?",
      "What risks make this idea hard to execute?"
    ]
  },
  "Seed": {
    "EdTech": [
      "What traction have you achieved with students/institutions?",
      "What is your acquisition cost per student/school?",
      "How do you measure learning outcomes?",
      "What is your revenue model and pricing?",
      "How will you scale to 10x users?"
    ],
    "FinTech": [
      "What regulatory licenses have you secured?",
      "What is your CAC and LTV?",
      "How are you mitigating fraud and risk?",
      "What traction have you shown in user growth?",
      "What is your core moat against competitors?"
    ],
    "HealthTech": [
      "What clinical pilots or trials have you run?",
      "How are you addressing HIPAA/GDPR compliance?",
      "What is your go-to-market strategy?",
      "How will you integrate with existing health systems?",
      "What outcomes have you demonstrated so far?"
    ],
    "Consumer": [
      "What channels are driving your growth?",
      "What is your repeat purchase rate?",
      "How are you managing supply chain reliability?",
      "How do you expand beyond your first city/market?",
      "What is your gross margin today?"
    ],
    "SaaS": [
      "What ARR/MRR have you reached?",
      "What is your churn rate?",
      "How are you building defensibility (data, ecosystem)?",
      "What is your GTM motion (self-serve vs enterprise)?",
      "What milestones will this Seed round unlock?"
    ],
    "Climate": [
      "What measurable impact have you proven?",
      "What partnerships do you have with governments or NGOs?",
      "What is your cost curve vs alternatives?",
      "What traction have you demonstrated with customers?",
      "What funding do you need for scaling impact?"
    ]
  },
  "Series A": {
    "EdTech": [
      "How do you prove product-market fit?",
      "What is your user retention and engagement story?",
      "What is your plan to 5x revenue in 18 months?",
      "What partnerships drive growth?",
      "How defensible is your model at scale?"
    ],
    "FinTech": [
      "What is your revenue growth trajectory?",
      "How do you expand to new markets with compliance?",
      "What is your path to profitability?",
      "What risks concern investors most, and how do you mitigate?",
      "How will you defend against large incumbents?"
    ],
    "HealthTech": [
      "What clinical results back your claims?",
      "What is your regulatory approval status?",
      "What is your commercialization strategy?",
      "How will you scale across geographies?",
      "What partnerships with pharma/hospitals exist?"
    ],
    "Consumer": [
      "What is your customer lifetime value vs acquisition cost?",
      "What are your unit economics?",
      "How are you expanding distribution and brand presence?",
      "What is your path to nationwide scale?",
      "Who are your biggest competitors and why will you win?"
    ],
    "SaaS": [
      "What is your current ARR and growth rate?",
      "What is your enterprise vs SMB split?",
      "How are you reducing churn?",
      "What ecosystem integrations are key?",
      "How do you defend against global SaaS giants?"
    ],
    "Climate": [
      "What is your cost per ton of CO2 saved?",
      "What is your revenue model at scale?",
      "How do you plan to reach global markets?",
      "What regulatory trends help or hurt you?",
      "What is your exit strategy—IPO, acquisition?"
    ]
  }
};

const INDUSTRIES = ["EdTech", "FinTech", "HealthTech", "Consumer", "SaaS", "Climate"];
const STAGES = ["Pre-Seed", "Seed", "Series A"];
const INVESTOR_TYPES = ["Angel", "VC", "PE"];

interface InvestorFeedbackData {
  recommendation: string;
  scorecard: {
    Problem: number;
    Solution: number;
    Market: number;
    Traction: number;
    BusinessModel: number;
    Defensibility: number;
    Team: number;
    Delivery: number;
  };
  strengths: string[];
  concerns: string[];
  dealbreakers: string[];
  followUps: string[];
  actionPlan: Array<{day: number; task: string}>;
  investorNotes: string;
  totalScore: number;
}

type Step = "setup" | "pitch" | "feedback";

interface PitchData {
  companyName: string;
  industry: string;
  stage: string;
  investorType: string;
  questions: string[];
  answers: string[];
  currentQuestion: number;
}

const MyPitchWorld = () => {
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [pitchData, setPitchData] = useState<PitchData>({
    companyName: "",
    industry: "",
    stage: "",
    investorType: "",
    questions: [],
    answers: [],
    currentQuestion: 0
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [feedbackData, setFeedbackData] = useState<InvestorFeedbackData | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const { toast } = useToast();

  const handleStartPitch = () => {
    if (!pitchData.companyName || !pitchData.industry || !pitchData.stage || !pitchData.investorType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before starting your pitch.",
        variant: "destructive"
      });
      return;
    }

    const questions = PITCH_QUESTIONS[pitchData.stage as keyof typeof PITCH_QUESTIONS]?.[pitchData.industry as keyof typeof PITCH_QUESTIONS[keyof typeof PITCH_QUESTIONS]] as string[] || [];
    
    if (questions.length === 0) {
      toast({
        title: "No Questions Available",
        description: "No questions found for this stage-industry combination.",
        variant: "destructive"
      });
      return;
    }
    
    setPitchData(prev => ({
      ...prev,
      questions: questions.slice(0, 5),
      answers: new Array(Math.min(5, questions.length)).fill("")
    }));
    setCurrentStep("pitch");
    toast({
      title: "Pitch Started!",
      description: "Good luck with your investor Q&A session."
    });
  };

  const handleAnswerSubmit = () => {
    const newAnswers = [...pitchData.answers];
    newAnswers[pitchData.currentQuestion] = currentAnswer;
    setPitchData(prev => ({
      ...prev,
      answers: newAnswers
    }));
    setCurrentAnswer("");

    if (pitchData.currentQuestion < pitchData.questions.length - 1) {
      setPitchData(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      toast({
        title: `Question ${pitchData.currentQuestion + 2}/${pitchData.questions.length}`,
        description: "Next question loaded."
      });
    } else {
      handleGetFeedback();
    }
  };

  const handleGetFeedback = async () => {
    setCurrentStep("feedback");
    setFeedbackLoading(true);
    
    try {
      // Build QA content for the prompt
      const qaData = pitchData.questions.map((question, index) => ({
        question,
        answer: pitchData.answers[index] || ""
      }));
      
      // Simulate AI call (replace with actual API call in production)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock investor feedback response
      const mockFeedback: InvestorFeedbackData = {
        recommendation: "Further Due Diligence",
        scorecard: {
          Problem: 4,
          Solution: 3,
          Market: 4,
          Traction: 2,
          BusinessModel: 3,
          Defensibility: 3,
          Team: 4,
          Delivery: 4
        },
        strengths: [
          "Clear problem articulation and market understanding",
          "Strong team background and domain expertise",
          "Well-thought-out go-to-market strategy"
        ],
        concerns: [
          "Limited traction metrics for current stage",
          "Competitive landscape analysis needs depth",
          "Revenue model scalability questions"
        ],
        dealbreakers: [],
        followUps: [
          "What specific metrics prove product-market fit?",
          "How do you plan to defend against well-funded competitors?",
          "What are your unit economics and path to profitability?"
        ],
        actionPlan: [
          {day: 1, task: "Prepare detailed traction metrics and growth charts"},
          {day: 2, task: "Research and analyze top 5 competitors in detail"},
          {day: 3, task: "Build comprehensive unit economics model"},
          {day: 4, task: "Prepare customer testimonials and case studies"},
          {day: 5, task: "Practice pitch delivery and Q&A responses"}
        ],
        investorNotes: "Promising startup with strong founding team. Needs to demonstrate stronger early traction and clearer differentiation strategy before investment consideration.",
        totalScore: 7
      };
      
      setFeedbackData(mockFeedback);
      toast({
        title: "Investor Feedback Generated!",
        description: "Your pitch analysis is ready."
      });
    } catch (error) {
      console.error('Feedback generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSpeakQuestion = () => {
    if (aiMode) {
      toast({
        title: "AI TTS Feature",
        description: "Connect to Supabase to enable AI-powered text-to-speech."
      });
    } else {
      const currentQuestion = pitchData.questions[pitchData.currentQuestion];
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

  const resetPitch = () => {
    setCurrentStep("setup");
    setPitchData({
      companyName: "",
      industry: "",
      stage: "",
      investorType: "",
      questions: [],
      answers: [],
      currentQuestion: 0
    });
    setCurrentAnswer("");
    setFeedbackData(null);
  };

  const progress = currentStep === "pitch" ? 
    ((pitchData.currentQuestion + 1) / pitchData.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
            MyPitch World
          </h1>
          <p className="text-xl font-body italic text-foreground/90 mb-4">
            "Pitch to AI investors. Practice. Improve. Convince."
          </p>
          <p className="text-lg font-body text-foreground/80 max-w-2xl mx-auto">
            Simulate real investor Q&A with role-specific and stage-specific questions. Get actionable feedback like a real VC panel.
          </p>
        </div>
      </section>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="font-ui"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-ui">M</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground font-heading">MyDebate.ai</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium font-ui text-foreground">Mode</span>
                <Button
                  variant={aiMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAiMode(!aiMode)}
                  className="font-ui"
                >
                  {aiMode ? "AI" : "Free"}
                </Button>
              </div>
              {currentStep === "pitch" && (
                <div className="text-sm font-medium font-ui text-primary">
                  Question {pitchData.currentQuestion + 1}/{pitchData.questions.length}
                </div>
              )}
            </div>
          </div>
          {currentStep === "pitch" && (
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
              <CardTitle className="text-3xl font-bold text-foreground font-heading">Pitch Setup</CardTitle>
              <CardDescription className="text-lg font-body text-foreground/80">
                Configure your startup details for investor Q&A practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground font-ui">Company Name</label>
                <Input
                  placeholder="Enter your company name"
                  value={pitchData.companyName}
                  onChange={(e) => setPitchData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-ui">Industry</label>
                <Select value={pitchData.industry} onValueChange={(value) => 
                  setPitchData(prev => ({ ...prev, industry: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-ui">Funding Stage</label>
                <Select value={pitchData.stage} onValueChange={(value) => 
                  setPitchData(prev => ({ ...prev, stage: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select funding stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-ui">Investor Type</label>
                <Select value={pitchData.investorType} onValueChange={(value) => 
                  setPitchData(prev => ({ ...prev, investorType: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select investor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTOR_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {pitchData.stage && pitchData.industry && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-ui">Expected Topics</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent font-ui">
                      Problem & Solution
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent font-ui">
                      Market Size
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent font-ui">
                      Business Model
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent font-ui">
                      Traction
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent font-ui">
                      Competition
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent font-ui">
                      Team
                    </Badge>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleStartPitch}
                className="w-full button-gradient text-white py-3 text-lg font-semibold font-ui rounded-xl"
                size="lg"
              >
                Start Pitch Q&A
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pitch Q&A */}
        {currentStep === "pitch" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Question Panel */}
            <Card className="rounded-xl card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-heading">
                  <span>Investor Question</span>
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
                    {pitchData.questions[pitchData.currentQuestion]}
                  </p>
                </div>
                <div className="mt-4 text-sm text-gray-600 font-body">
                  Think like you're in front of real investors. Be concise, data-driven, and confident.
                </div>
              </CardContent>
            </Card>

            {/* Answer Panel */}
            <Card className="rounded-xl card-shadow">
              <CardHeader>
                <CardTitle className="font-heading">Your Pitch Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your response to the investor..."
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

        {/* Step 3: Investor Feedback */}
        {currentStep === "feedback" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {feedbackLoading ? (
              <Card className="rounded-xl card-shadow">
                <CardContent className="py-16 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg font-body text-gray-600">Analyzing your pitch...</p>
                </CardContent>
              </Card>
            ) : feedbackData ? (
              <Card className="rounded-xl card-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-gray-900 font-heading">Investor Decision</CardTitle>
                  <CardDescription className="text-lg font-body">
                    VC-style evaluation of your pitch performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Investment Decision & Score */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center bg-primary/10 p-6 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2 font-heading">{feedbackData.recommendation}</div>
                      <div className="text-lg text-gray-700 font-body">Investment Decision</div>
                    </div>
                    <div className="text-center bg-success/10 p-6 rounded-lg">
                      <div className="text-4xl font-bold text-success mb-2 font-heading">{feedbackData.totalScore}/10</div>
                      <div className="text-lg text-gray-700 font-body">Overall Score</div>
                    </div>
                  </div>

                  {/* Investor Scorecard */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 font-heading">Investor Scorecard</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(feedbackData.scorecard).map(([criterion, score]) => (
                        <div key={criterion} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="font-body font-medium">{criterion}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={score * 20} className="w-24 h-2" />
                            <span className="font-ui font-bold text-primary">{score}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Concerns */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Strengths</h3>
                      <ul className="space-y-2">
                        {feedbackData.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-success">✓</span>
                            <span className="font-body">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Concerns & Risks</h3>
                      <ul className="space-y-2">
                        {feedbackData.concerns.map((concern, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-orange-500">⚠</span>
                            <span className="font-body">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Dealbreakers */}
                  {feedbackData.dealbreakers.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-red-600 font-heading">🚨 Dealbreakers</h3>
                      <div className="bg-red-50 p-4 rounded-lg space-y-2">
                        {feedbackData.dealbreakers.map((dealbreaker, index) => (
                          <p key={index} className="font-body text-red-700">• {dealbreaker}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 font-heading">Follow-up Investor Questions</h3>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      {feedbackData.followUps.map((question, index) => (
                        <p key={index} className="font-body text-blue-800">• {question}</p>
                      ))}
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 font-heading">5-Day Improvement Plan</h3>
                    <div className="space-y-2">
                      {feedbackData.actionPlan.map((plan, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold font-ui">
                            {plan.day}
                          </div>
                          <span className="font-body">{plan.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investor Notes */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 font-heading">Investor Notes</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <p className="font-body text-yellow-800 italic">"{feedbackData.investorNotes}"</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 pt-6">
                    <Button variant="outline" onClick={resetPitch} className="flex items-center space-x-2 font-ui">
                      <ArrowLeft size={16} />
                      <span>New Pitch</span>
                    </Button>
                    <Button className="flex items-center space-x-2 button-gradient font-ui rounded-xl">
                      <Save size={16} />
                      <span>Save Results</span>
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep("pitch")} className="flex items-center space-x-2 font-ui">
                      <RotateCcw size={16} />
                      <span>Try Again</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-xl card-shadow">
                <CardContent className="py-16 text-center">
                  <p className="text-lg font-body text-gray-600">No feedback data available.</p>
                </CardContent>
              </Card>
            )}
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

export default MyPitchWorld;