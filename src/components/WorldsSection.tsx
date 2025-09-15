import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WorldsSection = () => {
  const worlds = [
    {
      title: "MyDebate World",
      subtitle: "Be Ivy League ready with AI-powered debate practice",
      icon: "⚡",
      buttonText: "Enter Debate Arena",
      link: "/debate",
      gradient: "from-primary to-primary-alt"
    },
    {
      title: "MyInterview World", 
      subtitle: "Master campus interviews with personalized AI coaching",
      icon: "👔",
      buttonText: "Start Interview Practice",
      link: "/interview",
      gradient: "from-accent-blue to-primary"
    },
    {
      title: "MyPitch World",
      subtitle: "Perfect your startup pitch with investor-level feedback",
      icon: "🚀", 
      buttonText: "Pitch Like a Pro",
      link: "/pitch",
      gradient: "from-accent-green to-accent-blue"
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">
            Choose Your <span className="gradient-text">World</span>
          </h2>
          <p className="text-xl font-body text-muted-foreground max-w-2xl mx-auto">
            Three specialized environments designed to elevate your communication skills
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {worlds.map((world, index) => (
            <Card key={index} className="card-modern card-world group text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300" 
                   style={{
                     background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent-blue)) 100%)`
                   }} />
              
              <CardHeader className="pb-6 relative z-10">
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {world.icon}
                </div>
                <CardTitle className="text-2xl font-heading text-foreground mb-4">
                  {world.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg leading-relaxed font-body">
                  {world.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <Button 
                  className="button-primary w-full text-lg py-4 group-hover:scale-105 transition-transform duration-200" 
                  asChild
                >
                  <Link to={world.link}>{world.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorldsSection;