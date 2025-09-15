import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, Briefcase, TrendingUp, Globe, Mic, Target } from "lucide-react";

const worlds = [
  {
    id: "debate",
    title: "MyDebateWorld",
    description: "Battle AI opponents, simulate UN sessions, and compete in live arenas",
    icon: Swords,
    gradient: "from-red-500 to-orange-500",
    features: [
      { name: "AI Battle", icon: "⚡", description: "Challenge AI opponents in real-time debates" },
      { name: "MUN – United Nations", icon: "🌍", description: "Simulate UN sessions and diplomacy" },
      { name: "Live Arena", icon: "🎤", description: "Compete with other speakers worldwide" }
    ]
  },
  {
    id: "interview",
    title: "MyInterviewWorld",
    description: "Perfect your interview skills with AI-powered mock interviews",
    icon: Briefcase,
    gradient: "from-blue-500 to-purple-500",
    features: [
      { name: "Campus Simulator", icon: "🎓", description: "Practice with top company scenarios" },
      { name: "Company Selection", icon: "🏢", description: "Choose from TCS, Infosys, Accenture & more" },
      { name: "Real-time Feedback", icon: "📊", description: "Get instant AI analysis of your performance" }
    ]
  },
  {
    id: "pitch",
    title: "MyPitch.ai",
    description: "Master your startup pitch with AI investor simulation",
    icon: TrendingUp,
    gradient: "from-green-500 to-teal-500",
    features: [
      { name: "Startup Journey", icon: "🚀", description: "Practice at Prototype, Ideation, or MVP stage" },
      { name: "Industry Focus", icon: "🎯", description: "Tailor pitches to your specific industry" },
      { name: "Investor AI", icon: "💼", description: "Face tough questions from AI investors" }
    ]
  }
];

const WorldsSection = () => {
  return (
    <section id="worlds" className="py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 gradient-text">
            Choose Your World
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three specialized environments designed to transform you into a speaking superstar
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {worlds.map((world, index) => (
            <Card
              key={world.id}
              className="group hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/30 card-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${world.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <world.icon className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl font-heading font-bold">
                  {world.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {world.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {world.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{feature.name}</div>
                      <div className="text-xs text-muted-foreground">{feature.description}</div>
                    </div>
                  </div>
                ))}
                <Button variant="world" className="w-full mt-6" size="lg">
                  Enter {world.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button variant="feature" size="lg" className="flex items-center space-x-2">
              <Globe size={20} />
              <span>Global Leaderboard</span>
            </Button>
            <Button variant="feature" size="lg" className="flex items-center space-x-2">
              <Mic size={20} />
              <span>Voice Analysis</span>
            </Button>
            <Button variant="feature" size="lg" className="flex items-center space-x-2">
              <Target size={20} />
              <span>Skill Assessment</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldsSection;