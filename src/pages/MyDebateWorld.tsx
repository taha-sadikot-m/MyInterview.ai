import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { JudgePanel } from "@/components/JudgePanel";
import Navigation from "@/components/Navigation";
import { 
  Mic, 
  BookOpen, 
  Trophy, 
  Target, 
  Brain, 
  Users, 
  Award,
  Upload,
  Play,
  TrendingUp,
  Zap,
  Volume2,
  Calendar,
  MapPin,
  Clock,
  FileText,
  ExternalLink,
  Home
} from "lucide-react";

// Mock data
const MUN_VIDEOS = [
  { title: "MUN Basics", description: "Understanding Model United Nations", duration: "8 min", icon: BookOpen },
  { title: "Rules & Procedure", description: "Parliamentary procedure and debate flow", duration: "12 min", icon: Target },
  { title: "Country Research", description: "How to research and represent a country", duration: "10 min", icon: Brain }
];

const MUN_FAQS = [
  { 
    question: "What is GSL (General Speakers List)?", 
    answer: "The General Speakers List is the main list where delegates sign up to give speeches on the topic being discussed. Each delegate gets a set amount of time to present their country's position." 
  },
  { 
    question: "How do I draft a resolution?", 
    answer: "A resolution contains preambulatory clauses (background information) and operative clauses (specific actions). Start with 'The General Assembly,' followed by preambulatory clauses, then operative clauses with specific actions." 
  },
  { 
    question: "What's the difference between a motion and a resolution?", 
    answer: "A motion is a procedural request (like 'motion to extend debate time'), while a resolution is the final document with solutions to the issue being discussed." 
  }
];

const DEBATE_TOPICS = {
  ncert: [
    "Should homework be banned in schools?",
    "Is AI replacing teachers beneficial for education?", 
    "Should schools teach only in English or local languages?",
    "Climate change education should be mandatory",
    "Should school uniforms be compulsory?",
    "Online vs classroom learning effectiveness"
  ],
  genz: [
    "Social media pros and cons for teenagers",
    "Should smartphones be banned in schools?",
    "Influencers vs traditional teachers",
    "TikTok in education: helpful or harmful?", 
    "E-sports should be a school subject",
    "AI is a friend, not foe for students"
  ]
};

const SCHOOL_EVENTS = [
  { 
    title: "English Elocution", 
    description: "Master the art of public speaking in English",
    icon: Volume2,
    criteria: ["Expression", "Voice Modulation", "Body Language", "Content"]
  },
  { 
    title: "Assembly News Reading", 
    description: "Practice reading news with proper pace and pronunciation",
    icon: Mic,
    criteria: ["Pronunciation", "Pace", "Clarity", "Confidence"]
  },
  { 
    title: "Inter-School Debate Practice", 
    description: "Competitive debate formats and strategies",
    icon: Trophy,
    criteria: ["Logical Arguments", "Rebuttals", "Research", "Presentation"]
  }
];

const COMMITTEE_MOTIONS = [
  { 
    committee: "UNGA", 
    motions: ["Climate Action Implementation", "Global Education Standards", "Digital Divide Solutions"] 
  },
  { 
    committee: "UNICEF", 
    motions: ["Child Protection Online", "Educational Access", "Nutrition Security"] 
  },
  { 
    committee: "UNEP", 
    motions: ["Plastic Waste Management", "Renewable Energy Transition", "Biodiversity Conservation"] 
  },
  { 
    committee: "WHO", 
    motions: ["Mental Health Awareness", "Healthcare Accessibility", "Pandemic Preparedness"] 
  },
  { 
    committee: "UNHRC", 
    motions: ["Digital Rights", "Freedom of Expression", "Refugee Protection"] 
  },
  { 
    committee: "UNSC", 
    motions: ["Cybersecurity Threats", "Peace Building", "International Cooperation"] 
  }
];

const RESEARCH_LINKS = [
  { title: "CIA World Factbook", url: "#", description: "Comprehensive country data" },
  { title: "UNData", url: "#", description: "UN statistical database" },
  { title: "World Bank", url: "#", description: "Economic and development data" },
  { title: "UNICEF Data", url: "#", description: "Child welfare statistics" },
  { title: "Our World in Data", url: "#", description: "Research and data visualization" }
];

const LEADERBOARD_DATA = [
  { user: "Arjun M.", badge: "Top Orator", score: 92 },
  { user: "Priya S.", badge: "Best Rebuttal", score: 89 },
  { user: "Rohit K.", badge: "Quick Thinker", score: 87 },
  { user: "Sneha P.", badge: "Evidence Master", score: 85 },
  { user: "Vikram N.", badge: "Ivy Ready", score: 83 }
];

const UPCOMING_EVENTS = [
  {
    title: "Weekly Public Speaking Class",
    date: "Every Saturday",
    time: "5:00 PM IST",
    mode: "Online (Zoom)",
    type: "weekly"
  },
  {
    title: "Inter-School MUN Practice",
    date: "Dec 16, 2024",
    time: "10:00 AM IST", 
    mode: "On-campus",
    type: "event"
  },
  {
    title: "Debate Championship Prep",
    date: "Dec 17, 2024",
    time: "2:00 PM IST",
    mode: "Online",
    type: "event"
  }
];

type Section = 'chanakya' | 'mun' | 'events' | 'live' | 'leaderboard';

const MyDebateWorld = () => {
  const [activeSection, setActiveSection] = useState<Section>('chanakya');
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<'ncert' | 'genz'>('ncert');
  const [selectedEvent, setSelectedEvent] = useState("");
  const [showJudgePanel, setShowJudgePanel] = useState(false);
  const [currentStep, setCurrentStep] = useState<'topic' | 'recording' | 'feedback'>('topic');

  const handleRecordingComplete = (audioBlob: Blob, transcript: string) => {
    // Mock judge feedback - replace with actual API call
    setTimeout(() => {
      setShowJudgePanel(true);
      setCurrentStep('feedback');
    }, 2000);
  };

  const mockDebateJudgeData = {
    scores: {
      Clarity: 4,
      Evidence: 3,
      Rebuttal: 4,
      Delivery: 5,
      TimeDiscipline: 4
    },
    strengths: [
      "Excellent voice modulation and clear articulation",
      "Strong opening statement with compelling evidence",
      "Confident delivery and good eye contact"
    ],
    improvements: [
      "Include more statistical evidence to support claims",
      "Improve rebuttal structure with counter-arguments",
      "Practice concluding with a stronger call to action"
    ],
    evidence: [
      "According to recent studies, homework increases stress levels",
      "Countries like Finland have reduced homework with positive results"
    ],
    gslReframe: {
      before: "Homework is bad because it's stressful and takes too much time.",
      after: "Honorable delegates, extensive homework creates undue pressure on students and limits their holistic development. As evidenced by Finland's education success with minimal homework, we propose structured learning approaches that prioritize understanding over mechanical practice."
    },
    badgeUnlocks: ["Chanakya Challenger"]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
              MyDebateWorld
            </h1>
            
            {/* Tagline */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
              Battle with AI • Think fast • Speak smart
            </h2>
            
            {/* Subtext */}
            <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
              Step into the arena — sharpen your debating skills with AI-powered challenges, MUNs, and live arenas.
            </h3>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setActiveSection('chanakya')}
                size="lg" 
                className="btn-primary text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                <Zap className="w-5 h-5 mr-3" />
                Enter Debate Arena ⚡
              </Button>
              
              <Button 
                onClick={() => setActiveSection('chanakya')}
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                <Brain className="w-5 h-5 mr-3" />
                Try AI Battle 🤖
              </Button>
              
              <Button 
                onClick={() => setActiveSection('mun')}
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Start MUN Simulation 🌍
              </Button>
              
              <Button 
                onClick={() => setActiveSection('live')}
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                <Mic className="w-5 h-5 mr-3" />
                Join Live Arena 🎤
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="section-content">
        {/* Section A: Debate with Chanakya */}
        {activeSection === 'chanakya' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Debate with Chanakya
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Train with AI Chanakya, the ancient strategist, to master persuasive debate and logical argumentation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Topic Picker Card */}
              <Card className="card-world-class">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-2xl mb-4">Choose Your Topic</CardTitle>
                  <CardDescription className="font-body">
                    Select from NCERT curriculum themes or trending GenZ debates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Toggle */}
                  <div className="flex rounded-2xl bg-muted p-2">
                    <Button
                      onClick={() => setSelectedTopicCategory('ncert')}
                      className={`flex-1 rounded-xl transition-all ${
                        selectedTopicCategory === 'ncert' 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      NCERT Themes
                    </Button>
                    <Button
                      onClick={() => setSelectedTopicCategory('genz')}
                      className={`flex-1 rounded-xl transition-all ${
                        selectedTopicCategory === 'genz' 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Gen Z Topics
                    </Button>
                  </div>

                  {/* Topic Selector */}
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="h-14 font-ui text-lg">
                      <SelectValue placeholder="Choose your debate topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEBATE_TOPICS[selectedTopicCategory].map((topic, index) => (
                        <SelectItem key={index} value={topic} className="font-body py-3">
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Example Topics Display */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h5 className="font-ui font-medium mb-3 text-sm text-muted-foreground">
                      {selectedTopicCategory === 'ncert' ? 'NCERT Examples:' : 'GenZ Examples:'}
                    </h5>
                    <div className="space-y-2">
                      {DEBATE_TOPICS[selectedTopicCategory].slice(0, 3).map((topic, index) => (
                        <p key={index} className="font-body text-sm text-foreground italic">
                          • {topic}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Loop Card */}
              <Card className="card-world-class">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-2xl mb-4">Voice Practice</CardTitle>
                  <CardDescription className="font-body">
                    AI Chanakya will guide you through the debate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedTopic && (
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="font-body text-sm text-muted-foreground mb-2">Selected Topic:</p>
                      <p className="font-ui font-medium text-foreground">{selectedTopic}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button 
                      className="btn-outline-indigo w-full h-12"
                      disabled={!selectedTopic}
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      Hear Motion (TTS)
                    </Button>

                    <VoiceRecorder 
                      onRecordingComplete={handleRecordingComplete}
                      placeholder="Press the mic to respond with your 90-second argument"
                      maxDuration={90}
                    />

                    <div className="text-center text-sm text-muted-foreground">
                      Chanakya will ask 2-3 follow-up questions after your speech
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Judge Panel Results */}
            {showJudgePanel && (
              <div className="mt-16 fade-in">
                <JudgePanel type="debate" data={mockDebateJudgeData} />
                <div className="flex justify-center gap-6 mt-8">
                  <Button 
                    onClick={() => {
                      setCurrentStep('topic');
                      setShowJudgePanel(false);
                      setSelectedTopic("");
                    }}
                    className="btn-indigo"
                  >
                    Practice Again
                  </Button>
                  <Button variant="outline" className="btn-outline-indigo">
                    Save to Dashboard
                  </Button>
                  <Button variant="outline" className="btn-outline-indigo">
                    Download Report
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section B: MUN World */}
        {activeSection === 'mun' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                MUN World — Learn, Research, Upload & Improve
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Complete MUN preparation with resources, practice, and AI feedback.
              </p>
            </div>

            {/* Resource Tiles */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* MUN 101 Videos */}
              <Card className="card-world-class">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl">MUN 101 Videos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {MUN_VIDEOS.map((video, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                      <video.icon className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <h5 className="font-ui font-medium">{video.title}</h5>
                        <p className="font-body text-sm text-muted-foreground">{video.description}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">{video.duration}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* GSL Upload */}
              <Card className="card-world-class">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl">GSL Upload & Practice</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center">
                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="font-body text-muted-foreground mb-4">
                      Upload your GSL speech or position paper
                    </p>
                    <p className="font-body text-xs text-muted-foreground mb-4">
                      Supports PDF, DOCX, Audio, Video files
                    </p>
                    <Button className="btn-indigo">Choose File</Button>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-body text-sm text-muted-foreground mb-4">or</p>
                    <Button className="btn-outline-indigo w-full">
                      <Mic className="w-5 h-5 mr-2" />
                      Record GSL Speech
                    </Button>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="font-body text-blue-800 text-sm">
                      <strong>AI Judge will evaluate:</strong> Content, Structure, Delivery, Time Discipline + Provide GSL reframe suggestions
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Country Atlas & Data */}
              <Card className="card-world-class">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl">Country Atlas & Data</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {RESEARCH_LINKS.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                      <div>
                        <h5 className="font-ui font-medium">{link.title}</h5>
                        <p className="font-body text-xs text-muted-foreground">{link.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Research References */}
              <Card className="card-world-class">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl">Research References</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-xl">
                      <h5 className="font-ui font-medium">UN Committees Explainer</h5>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl">
                      <h5 className="font-ui font-medium">Sample Position Papers</h5>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl">
                      <h5 className="font-ui font-medium">Past Resolutions Database</h5>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl">
                      <h5 className="font-ui font-medium">Model Working Papers</h5>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Committee Motions Strip */}
            <div className="mb-16">
              <h3 className="font-heading text-2xl font-bold mb-8 text-center">Committee Motions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COMMITTEE_MOTIONS.map((committee, index) => (
                  <Card key={index} className="card-world-class">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg text-center">{committee.committee}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {committee.motions.map((motion, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 rounded-xl">
                          <p className="font-body text-sm mb-2">{motion}</p>
                          <Button size="sm" className="btn-indigo w-full">
                            Practice Now
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="card-world-class">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription className="font-body">Common MUN questions answered</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {MUN_FAQS.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="font-ui font-medium text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Section C: School Events */}
        {activeSection === 'events' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Train for Your School Events
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Prepare for real Indian school competitions with AI-powered practice and feedback.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {SCHOOL_EVENTS.map((event, index) => (
                <Card key={index} className="card-world-class hover-lift">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <event.icon className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl mb-4">{event.title}</CardTitle>
                    <CardDescription className="font-body">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h5 className="font-ui font-medium mb-4">Judging Criteria:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {event.criteria.map((criterion, idx) => (
                          <Badge key={idx} className="bg-primary/10 text-primary text-xs justify-center">
                            {criterion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="btn-indigo w-full h-12">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload File
                      </Button>
                      <Button variant="outline" className="btn-outline-indigo w-full h-12">
                        <Mic className="w-5 h-5 mr-2" />
                        Record Practice
                      </Button>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="font-body text-green-800 text-sm">
                        <strong>AI Judge provides:</strong> Detailed feedback + score breakdown + improvement suggestions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Section D: Live Class & Weekly Events */}
        {activeSection === 'live' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Live Classes & Community Events
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Join our live sessions and build lasting speaking habits with the community.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Weekly Class */}
              <Card className="card-world-class border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-3xl mb-4">Live Public Speaking Class</CardTitle>
                  <CardDescription className="font-body text-lg">
                    Every Saturday — Build confidence with expert guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="flex justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-ui font-medium">Weekly, Saturday</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-ui font-medium">5:00 PM IST</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-ui font-medium">Online (Zoom)</span>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                    <Zap className="w-4 h-4" />
                    <span className="font-ui font-medium text-sm">Seats Limited</span>
                  </div>

                  <Button className="btn-indigo min-w-[280px] h-16 text-lg">
                    <Users className="w-6 h-6 mr-3" />
                    Book My Spot
                  </Button>
                </CardContent>
              </Card>

              {/* Community Events */}
              <div>
                <h3 className="font-heading text-2xl font-bold mb-8 text-center">Community Events</h3>
                <div className="space-y-6">
                  {UPCOMING_EVENTS.filter(event => event.type === 'event').map((event, index) => (
                    <Card key={index} className="card-world-class">
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-heading text-xl font-bold mb-2">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.mode}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button className="btn-indigo">
                          Register
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section E: Leaderboards & Badges */}
        {activeSection === 'leaderboard' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Leaderboards & Achievements
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Track your progress and celebrate milestones with the community.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* Weekly Leaderboards */}
              <Card className="card-world-class">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-2xl mb-4">Weekly Leaderboards</CardTitle>
                  <CardDescription className="font-body">
                    Top performers across different skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LEADERBOARD_DATA.map((leader, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-ui font-bold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <h5 className="font-ui font-medium">{leader.user}</h5>
                            <p className="font-body text-sm text-muted-foreground">{leader.badge}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-ui font-bold text-lg text-primary">{leader.score}</span>
                          <p className="font-body text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card className="card-world-class">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-2xl mb-4">Achievement Badges</CardTitle>
                  <CardDescription className="font-body">
                    Unlock badges as you progress through your speaking journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                      <div className="text-4xl mb-3">🥉</div>
                      <h5 className="font-ui font-medium text-green-800">Novice</h5>
                      <p className="font-body text-sm text-green-600">Complete first debate</p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="text-4xl mb-3">🏆</div>
                      <h5 className="font-ui font-medium text-blue-800">Chanakya Challenger</h5>
                      <p className="font-body text-sm text-blue-600">Score 4+ in all criteria</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
                      <div className="text-4xl mb-3">👑</div>
                      <h5 className="font-ui font-medium text-purple-800">Ivy Ready</h5>
                      <p className="font-body text-sm text-purple-600">Master advanced debates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button className="btn-indigo">
                  <Trophy className="w-5 h-5 mr-2" />
                  Join a Weekend Event
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Navigation Pills */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border border-border p-2 z-50">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveSection('chanakya')}
            size="sm"
            className={activeSection === 'chanakya' ? 'btn-indigo' : 'btn-outline-indigo'}
          >
            Chanakya
          </Button>
          <Button
            onClick={() => setActiveSection('mun')}
            size="sm"
            className={activeSection === 'mun' ? 'btn-indigo' : 'btn-outline-indigo'}
          >
            MUN
          </Button>
          <Button
            onClick={() => setActiveSection('events')}
            size="sm"
            className={activeSection === 'events' ? 'btn-indigo' : 'btn-outline-indigo'}
          >
            Events
          </Button>
          <Button
            onClick={() => setActiveSection('live')}
            size="sm"
            className={activeSection === 'live' ? 'btn-indigo' : 'btn-outline-indigo'}
          >
            Live
          </Button>
          <Button
            onClick={() => setActiveSection('leaderboard')}
            size="sm"
            className={activeSection === 'leaderboard' ? 'btn-indigo' : 'btn-outline-indigo'}
          >
            Board
          </Button>
        </div>
      </div>

      {/* Services Strip */}
      <section className="bg-muted/30 section-padding">
        <div className="section-content">
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl font-bold mb-4">1-on-1 Training</h3>
            <p className="font-body text-lg text-muted-foreground">Get personalized coaching from expert trainers</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="card-world-class text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-heading text-xl font-bold mb-4">Debate Coaching</h4>
                <p className="font-body text-muted-foreground mb-6">
                  Personalized speech structure, rebuttal training, and delivery improvement
                </p>
                <Button className="btn-indigo">Book Now</Button>
              </CardContent>
            </Card>
            
            <Card className="card-world-class text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-heading text-xl font-bold mb-4">Interview Coaching</h4>
                <p className="font-body text-muted-foreground mb-6">
                  HR + role-specific mock interviews with detailed recruiter panel feedback
                </p>
                <Button className="btn-indigo">Book Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyDebateWorld;