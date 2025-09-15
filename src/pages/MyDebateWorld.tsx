import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Play, 
  Upload, 
  Star, 
  Target, 
  Globe, 
  Users, 
  BookOpen,
  Trophy,
  Volume2,
  VideoIcon,
  Award,
  CheckCircle,
  PlusCircle
} from "lucide-react";

const MyDebateWorld = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [recordingSection, setRecordingSection] = useState<string | null>(null);

  const munTopics = [
    "UNHRC: Rights of Indigenous Communities",
    "UNSC: Maritime Disputes in South China Sea", 
    "WHO: Global Mental Health Crisis",
    "UNESCO: Digital Divide in Education"
  ];

  const genZTopics = [
    "Should AI Replace Teachers?",
    "TikTok in the Classroom: Good or Bad?",
    "E-sports as Official School Sport",
    "Climate Change vs Economic Growth",
    "Social Media Impact on Teen Mental Health",
    "Online Learning vs Traditional Classes"
  ];

  const schoolEvents = [
    {
      title: "News Reading in Assembly",
      description: "Upload your morning assembly news reading",
      icon: <Volume2 className="w-6 h-6" />
    },
    {
      title: "English Elocution",
      description: "Pick a passage or poem and record your performance",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: "Extempore",
      description: "Random school/GenZ topic - answer live",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Storytelling",
      description: "Upload or record your story - get AI evaluation",
      icon: <Star className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-modern min-h-[70vh] flex items-center justify-center relative">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-hero text-white leading-tight">
                Debate World — Be Ivy League Ready
              </h1>
              <p className="text-2xl md:text-3xl font-tagline text-white/90 italic">
                Learn, Practice & Compete in Debates, MUNs, and School Events.
              </p>
            </div>

            {/* 3 Large CTAs */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                className="button-primary text-lg px-8 py-6 min-w-[280px] rounded-xl hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('debate-chanakya')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Users className="w-6 h-6 mr-3" />
                Debate with Chanakya
              </Button>
              <Button 
                className="button-primary text-lg px-8 py-6 min-w-[280px] rounded-xl hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('mun-101')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Globe className="w-6 h-6 mr-3" />
                MUN 101
              </Button>
              <Button 
                className="button-primary text-lg px-8 py-6 min-w-[280px] rounded-xl hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('school-events')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Trophy className="w-6 h-6 mr-3" />
                School Events Practice
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: MUN 101 */}
      <section id="mun-101" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              What is MUN?
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto">
              Master the art of diplomacy with our comprehensive MUN training program
            </p>
          </div>

          {/* Video Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "MUN Basics", description: "Understanding the fundamentals" },
              { title: "Rules & Procedures", description: "Parliamentary procedure made simple" },
              { title: "Country Research", description: "How to represent your nation" }
            ].map((video, index) => (
              <Card key={index} className="card-modern hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
                    <VideoIcon className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="font-heading text-xl">{video.title}</CardTitle>
                  <CardDescription className="font-body">{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full button-primary rounded-xl">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Accordion */}
          <Card className="card-modern max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="gsl">
                  <AccordionTrigger className="font-ui text-left">What is a General Speakers List (GSL)?</AccordionTrigger>
                  <AccordionContent className="font-body">
                    A GSL is the primary speaking format where delegates deliver formal speeches on the topic, typically 60-90 seconds for school MUNs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="draft">
                  <AccordionTrigger className="font-ui text-left">How do I draft an effective speech?</AccordionTrigger>
                  <AccordionContent className="font-body">
                    Structure your speech with: Country position → Evidence/Examples → Proposed solutions → Call for action. Practice the 3-point rule.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="poi">
                  <AccordionTrigger className="font-ui text-left">What are Points of Information?</AccordionTrigger>
                  <AccordionContent className="font-body">
                    POIs are questions delegates ask during speeches to clarify positions or challenge arguments. Keep them under 15 seconds.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Debate with Chanakya */}
      <section id="debate-chanakya" className="section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Practice Your Debate Skills
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto">
              Train with Chanakya, our AI debate coach, and get personalized feedback on every argument
            </p>
          </div>

          <Card className="card-modern max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-heading text-2xl flex items-center">
                <Users className="w-8 h-8 mr-3 text-primary" />
                AI Debate Practice Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step-by-step instructions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">1</div>
                    <div>
                      <h4 className="font-ui font-semibold">Pick a Topic</h4>
                      <p className="font-body text-sm text-muted-foreground">Choose from syllabus or GenZ topics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">2</div>
                    <div>
                      <h4 className="font-ui font-semibold">AI Asks by Voice</h4>
                      <p className="font-body text-sm text-muted-foreground">Press mic → AI asks question</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">3</div>
                    <div>
                      <h4 className="font-ui font-semibold">Answer by Voice</h4>
                      <p className="font-body text-sm text-muted-foreground">Speak your argument clearly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">4</div>
                    <div>
                      <h4 className="font-ui font-semibold">AI Judge Feedback</h4>
                      <p className="font-body text-sm text-muted-foreground">Scores on 4 key areas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scoring Areas */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl">
                <h4 className="font-ui font-semibold mb-4 text-center">AI Judge Scoring Areas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Clarity", "Logic", "Delivery", "Confidence"].map((area) => (
                    <div key={area} className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-body text-sm font-medium">{area}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full button-primary text-xl py-6 rounded-xl hover:scale-105 transition-all duration-300"
                onClick={() => setRecordingSection('debate')}
              >
                <Mic className="w-6 h-6 mr-3" />
                Start Debate Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: School Events */}
      <section id="school-events" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Prepare for Your School Events
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto">
              Practice and perfect your performance for assembly, elocution, and competitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {schoolEvents.map((event, index) => (
              <Card key={index} className="card-modern hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 text-white">
                    {event.icon}
                  </div>
                  <CardTitle className="font-heading text-xl">{event.title}</CardTitle>
                  <CardDescription className="font-body">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-body text-sm text-muted-foreground">
                      Drag & drop audio file or click to upload
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button 
                      className="flex-1 button-primary rounded-xl"
                      onClick={() => setRecordingSection(event.title)}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Record
                    </Button>
                  </div>
                  
                  {recordingSection === event.title && (
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-xl">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-ui font-medium">Recording...</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setRecordingSection(null)}
                        >
                          Stop
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Upload GSL Speech */}
      <section className="section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Upload Your GSL Speech
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto">
              Get professional feedback on your General Speakers List performance
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Upload Section */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Record or Upload GSL Speech</CardTitle>
                <CardDescription className="font-body">
                  Upload your 60-90 second General Speakers List speech for detailed analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-body text-lg font-medium mb-2">Drop your audio file here</p>
                  <p className="font-body text-sm text-muted-foreground">MP3, WAV, or M4A up to 10MB</p>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <Button 
                    className="flex-1 button-primary rounded-xl"
                    onClick={() => setRecordingSection('gsl')}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Record Live
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Judge's Panel Preview */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center">
                  <Award className="w-6 h-6 mr-2 text-primary" />
                  Judge's Panel Feedback
                </CardTitle>
                <CardDescription className="font-body">
                  Professional evaluation based on MUN standards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Bars */}
                <div className="space-y-3">
                  {[
                    { label: "Content", score: 85 },
                    { label: "Structure", score: 78 },
                    { label: "Delivery", score: 92 },
                    { label: "Time Discipline", score: 88 }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm font-ui mb-1">
                        <span>{item.label}</span>
                        <span>{item.score}/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-1000"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-ui font-semibold text-sm mb-2 text-green-600">Strengths (3)</h5>
                    <ul className="text-sm font-body space-y-1 text-muted-foreground">
                      <li>• Clear country position statement</li>
                      <li>• Strong statistical evidence</li>
                      <li>• Confident vocal delivery</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-ui font-semibold text-sm mb-2 text-amber-600">Improvements (3)</h5>
                    <ul className="text-sm font-body space-y-1 text-muted-foreground">
                      <li>• Add transitional phrases</li>
                      <li>• Slow down during key points</li>
                      <li>• Include call-to-action</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: Gen Z Topics Library */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Gen Z Topics Library
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto">
              Practice with modern, relevant topics that matter to your generation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genZTopics.map((topic, index) => (
              <Card key={index} className="card-modern hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                      <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">GenZ</Badge>
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold mb-3 leading-tight">
                    {topic}
                  </h3>
                  
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    Practice this trending topic with AI moderation and real-time feedback
                  </p>
                  
                  <Button 
                    className="w-full button-primary rounded-xl hover:scale-105 transition-all duration-200"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    Practice Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Traditional MUN Topics */}
          <div className="mt-16">
            <h3 className="text-2xl font-heading font-bold text-center mb-8">Traditional MUN Topics</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {munTopics.map((topic, index) => (
                <Card key={index} className="card-modern hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">MUN</Badge>
                    </div>
                    
                    <h3 className="font-heading text-lg font-semibold mb-3 leading-tight">
                      {topic}
                    </h3>
                    
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl border-secondary hover:bg-secondary/10"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      Practice Diplomacy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyDebateWorld;