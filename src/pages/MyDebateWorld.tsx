import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { JudgePanel } from "@/components/JudgePanel";
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
  Volume2
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

const DEBATE_TOPICS = [
  // NCERT Curriculum Topics
  "Should homework be banned in schools?",
  "Is AI replacing teachers beneficial for education?",
  "Should schools teach only in English or local languages?",
  "Climate change education should be mandatory",
  "Social media pros and cons for teenagers",
  "Should school uniforms be compulsory?",
  "Online vs classroom learning effectiveness",
  "Should smartphones be banned in schools?",
  // GenZ Topics
  "Influencers vs traditional teachers",
  "TikTok in education: helpful or harmful?",
  "E-sports should be a school subject",
  "AI is a friend, not foe for students",
  "Instagram vs reality: impact on teens"
];

const SCHOOL_EVENTS = [
  { 
    title: "News Reading in Assembly", 
    description: "Practice reading news with proper pace and pronunciation",
    icon: Mic,
    criteria: ["Pronunciation", "Pace", "Clarity", "Confidence"]
  },
  { 
    title: "English Elocution", 
    description: "Master the art of public speaking in English",
    icon: Volume2,
    criteria: ["Expression", "Voice Modulation", "Body Language", "Content"]
  },
  { 
    title: "Hindi/Regional Recitation", 
    description: "Perfect your Hindi or regional language delivery",
    icon: BookOpen,
    criteria: ["Language Fluency", "Expression", "Cultural Context", "Delivery"]
  },
  { 
    title: "Extempore", 
    description: "Impromptu speaking on random topics",
    icon: Brain,
    criteria: ["Quick Thinking", "Structure", "Confidence", "Time Management"]
  },
  { 
    title: "Storytelling/Narration", 
    description: "Engage audience with compelling storytelling",
    icon: Target,
    criteria: ["Creativity", "Engagement", "Voice Variation", "Timing"]
  },
  { 
    title: "House/Inter-School Debate", 
    description: "Competitive debate formats and strategies",
    icon: Trophy,
    criteria: ["Logical Arguments", "Rebuttals", "Research", "Presentation"]
  }
];

const LEADERBOARD_DATA = [
  { user: "Arjun M.", badge: "Top Orator", score: 92 },
  { user: "Priya S.", badge: "Best Rebuttal", score: 89 },
  { user: "Rohit K.", badge: "Quick Thinker", score: 87 },
  { user: "Sneha P.", badge: "Evidence Master", score: 85 },
  { user: "Vikram N.", badge: "Ivy Ready", score: 83 }
];

type Section = 'mun' | 'practice' | 'events' | 'gsl' | 'topics' | 'leaderboard';

const MyDebateWorld = () => {
  const [activeSection, setActiveSection] = useState<Section>('mun');
  const [selectedTopic, setSelectedTopic] = useState("");
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
      {/* Hero Section */}
      <section className="hero-indigo section-padding">
        <div className="section-content text-center relative z-10">
          <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6">
            Debate World — Be Ivy League Ready
          </h1>
          <p className="font-tagline text-2xl md:text-3xl text-white/95 mb-12">
            Learn MUN, practice debates, and prepare for real Indian school events.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <Button 
              onClick={() => setActiveSection('practice')}
              className="btn-indigo min-w-[280px] h-16 text-lg"
            >
              <Brain className="w-6 h-6 mr-3" />
              Debate with Chanakya
            </Button>
            
            <Button 
              onClick={() => setActiveSection('mun')}
              className="btn-outline-indigo min-w-[280px] h-16 text-lg"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              MUN 101
            </Button>
            
            <Button 
              onClick={() => setActiveSection('events')}
              className="btn-outline-indigo min-w-[280px] h-16 text-lg"
            >
              <Trophy className="w-6 h-6 mr-3" />
              School Events
            </Button>
          </div>
        </div>
      </section>

      <div className="section-content">
        {/* MUN 101 Section */}
        {activeSection === 'mun' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                MUN 101 - Learn the Fundamentals
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Master Model United Nations with comprehensive guides and expert insights.
              </p>
            </div>

            {/* Video Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {MUN_VIDEOS.map((video, index) => (
                <Card key={index} className="card-world-class hover-lift">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <video.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl">{video.title}</CardTitle>
                    <CardDescription className="font-body">{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge className="bg-primary/10 text-primary mb-4">{video.duration}</Badge>
                    <Button className="btn-indigo w-full">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
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

        {/* Debate Practice Section */}
        {activeSection === 'practice' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Practice Your Debate Skills
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Train with AI Chanakya, the ancient strategist, to master persuasive debate and logical argumentation.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {currentStep === 'topic' && (
                <Card className="card-world-class">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Target className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-3xl mb-4">Choose Your Debate Topic</CardTitle>
                    <CardDescription className="font-body text-lg">
                      Select from NCERT curriculum topics or trending GenZ debates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="max-w-md mx-auto">
                      <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger className="h-14 font-ui text-lg">
                          <SelectValue placeholder="Choose your debate topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEBATE_TOPICS.map((topic, index) => (
                            <SelectItem key={index} value={topic} className="font-body py-3">
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-center">
                      <Button 
                        onClick={() => setCurrentStep('recording')}
                        disabled={!selectedTopic}
                        className="btn-indigo min-w-[320px] h-16 text-lg"
                      >
                        <Brain className="w-6 h-6 mr-3" />
                        Start Debate with Chanakya
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'recording' && (
                <Card className="card-world-class">
                  <CardHeader className="text-center">
                    <CardTitle className="font-heading text-2xl mb-4">Debate Topic</CardTitle>
                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                      <p className="font-body text-lg text-foreground">{selectedTopic}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <VoiceRecorder 
                      onRecordingComplete={handleRecordingComplete}
                      placeholder="AI Chanakya will ask you questions. Press the mic to respond with your arguments."
                      maxDuration={90}
                    />
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="font-body text-blue-800">
                        💡 <strong>Tip:</strong> Structure your argument with evidence, explain your reasoning clearly, and be ready for follow-up questions from Chanakya.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'feedback' && showJudgePanel && (
                <div className="fade-in">
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
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* School Events Section */}
        {activeSection === 'events' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Indian School Events
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Prepare for real school competitions with AI-powered practice and feedback.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SCHOOL_EVENTS.map((event, index) => (
                <Card key={index} className="card-world-class hover-lift">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <event.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="font-body">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="font-ui font-medium mb-3">Judging Criteria:</h5>
                      <div className="flex flex-wrap gap-2">
                        {event.criteria.map((criterion, idx) => (
                          <Badge key={idx} className="bg-primary/10 text-primary text-xs">
                            {criterion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex gap-3">
                        <Button size="sm" className="btn-indigo flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                        <Button size="sm" variant="outline" className="btn-outline-indigo flex-1">
                          <Mic className="w-4 h-4 mr-2" />
                          Record
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* GenZ Topics Section */}
        {activeSection === 'topics' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                GenZ Topics Library
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Modern debate topics that matter to your generation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {DEBATE_TOPICS.slice(8).map((topic, index) => (
                <Card key={index} className="card-world-class hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                      <Badge className="bg-primary/10 text-primary">Trending</Badge>
                    </div>
                    <CardTitle className="font-heading text-lg">{topic}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="btn-indigo w-full">
                      <Brain className="w-5 h-5 mr-2" />
                      Practice Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Leaderboards Section */}
        {activeSection === 'leaderboard' && (
          <section className="section-padding fade-in">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl font-bold mb-6 text-foreground">
                Leaderboards & Badges
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
                Track your progress and compete with fellow debaters.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="card-world-class">
                <CardHeader className="text-center">
                  <CardTitle className="font-heading text-2xl mb-4 flex items-center justify-center">
                    <Trophy className="w-8 h-8 mr-3 text-primary" />
                    Weekly Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LEADERBOARD_DATA.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-ui font-bold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-ui font-medium">{entry.user}</p>
                            <Badge className="bg-primary/10 text-primary text-xs">{entry.badge}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-ui font-bold text-lg">{entry.score}</p>
                          <p className="font-body text-sm text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Navigation Tabs */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="card-world-class">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <Button
                  variant={activeSection === 'mun' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('mun')}
                  className={activeSection === 'mun' ? 'btn-indigo' : 'btn-outline-indigo'}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  MUN 101
                </Button>
                <Button
                  variant={activeSection === 'practice' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('practice')}
                  className={activeSection === 'practice' ? 'btn-indigo' : 'btn-outline-indigo'}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Practice
                </Button>
                <Button
                  variant={activeSection === 'events' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('events')}
                  className={activeSection === 'events' ? 'btn-indigo' : 'btn-outline-indigo'}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Events
                </Button>
                <Button
                  variant={activeSection === 'topics' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('topics')}
                  className={activeSection === 'topics' ? 'btn-indigo' : 'btn-outline-indigo'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Topics
                </Button>
                <Button
                  variant={activeSection === 'leaderboard' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('leaderboard')}
                  className={activeSection === 'leaderboard' ? 'btn-indigo' : 'btn-outline-indigo'}
                >
                  <Award className="w-5 h-5 mr-2" />
                  Rankings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Strip */}
        <section className="section-padding bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold mb-4 text-foreground">
              1-on-1 Training
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Get personalized coaching from expert trainers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="card-world-class text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl">Debate Coaching</CardTitle>
                <CardDescription className="font-body">
                  Master speech structure, rebuttal techniques, and confident delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="btn-indigo w-full">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="card-world-class text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl">MUN Training</CardTitle>
                <CardDescription className="font-body">
                  Learn parliamentary procedure, resolution writing, and negotiation
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

export default MyDebateWorld;