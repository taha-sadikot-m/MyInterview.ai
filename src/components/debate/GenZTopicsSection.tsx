import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Smartphone, 
  Gamepad2, 
  Leaf, 
  Users, 
  BookOpen, 
  Mic, 
  TrendingUp,
  Globe,
  Heart,
  Camera,
  Music
} from "lucide-react";

export const GenZTopicsSection = () => {
  const topics = [
    {
      title: "AI vs Teachers",
      description: "Should artificial intelligence replace human teachers in classrooms?",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      category: "Technology",
      difficulty: "Advanced",
    },
    {
      title: "TikTok in Education",
      description: "Can social media platforms be effective educational tools?",
      icon: Smartphone,
      color: "from-pink-500 to-pink-600",
      category: "Social Media",
      difficulty: "Intermediate",
    },
    {
      title: "E-sports as Career",
      description: "Should parents support children pursuing professional gaming?",
      icon: Gamepad2,
      color: "from-blue-500 to-blue-600",
      category: "Career",
      difficulty: "Intermediate",
    },
    {
      title: "Climate Change Action",
      description: "Should students be allowed to skip school for climate protests?",
      icon: Leaf,
      color: "from-green-500 to-green-600",
      category: "Environment",
      difficulty: "Advanced",
    },
    {
      title: "Mental Health Priority",
      description: "Should schools prioritize mental health over academic performance?",
      icon: Heart,
      color: "from-rose-500 to-rose-600",
      category: "Health",
      difficulty: "Advanced",
    },
    {
      title: "Online vs Offline Friends",
      description: "Are online friendships as valuable as face-to-face relationships?",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      category: "Social",
      difficulty: "Beginner",
    },
    {
      title: "Digital Detox for Teens",
      description: "Should teenagers have mandatory screen-free time daily?",
      icon: Camera,
      color: "from-cyan-500 to-cyan-600",
      category: "Lifestyle",
      difficulty: "Intermediate",
    },
    {
      title: "Standardized Testing",
      description: "Are standardized tests an effective measure of student ability?",
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
      category: "Education",
      difficulty: "Advanced",
    },
    {
      title: "Music Streaming Impact",
      description: "Has streaming changed the way we appreciate music?",
      icon: Music,
      color: "from-violet-500 to-violet-600",
      category: "Culture",
      difficulty: "Beginner",
    },
    {
      title: "Global Youth Activism",
      description: "Should young people lead social and political movements?",
      icon: Globe,
      color: "from-emerald-500 to-emerald-600",
      category: "Politics",
      difficulty: "Advanced",
    },
    {
      title: "Influencer Education",
      description: "Can social media influencers be legitimate educators?",
      icon: TrendingUp,
      color: "from-amber-500 to-amber-600",
      category: "Media",
      difficulty: "Intermediate",
    },
    {
      title: "Digital Privacy Rights",
      description: "Should teenagers have complete privacy online from parents?",
      icon: Smartphone,
      color: "from-red-500 to-red-600",
      category: "Rights",
      difficulty: "Advanced",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-6xl mb-6 gradient-text">
            Gen Z Topics Library
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Debate the issues that matter to your generation. From AI in education to climate activism, practice with topics that shape your world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <Card key={index} className="card-modern group border-primary/20 hover:border-primary/40 transition-all duration-300 h-full flex flex-col">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <topic.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-ui font-semibold ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-ui font-semibold bg-primary/10 text-primary">
                      {topic.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  {topic.description}
                </p>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full button-primary group-hover:shadow-glow"
                size="lg"
              >
                <Mic className="w-4 h-4 mr-2" />
                Practice Now
              </Button>

              {/* Debate Stats Preview */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-ui text-muted-foreground">Avg. Debate Time</span>
                  <span className="font-ui font-semibold text-foreground">3-5 mins</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="font-ui text-muted-foreground">Popular Arguments</span>
                  <span className="font-ui font-semibold text-foreground">Pro/Con 60/40</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="card-modern max-w-2xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <h3 className="font-heading text-2xl mb-4 text-foreground">
                Can't find your topic?
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Suggest new Gen Z debate topics or create custom debate scenarios for your school events.
              </p>
              <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary">
                Suggest New Topic
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};