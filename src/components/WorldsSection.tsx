import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WorldsSection = () => {
  const worlds = [
    {
      title: "MyDebate World",
      subtitle: "MUN Arena & Debate with Chanakya",
      icon: "🏛️",
      buttonText: "Enter Arena"
    },
    {
      title: "MyInterview World",
      subtitle: "Practice campus interviews with AI",
      icon: "💼",
      buttonText: "Start Practice",
      link: "/interview"
    },
    {
      title: "MyPitch World",
      subtitle: "Simulate your investor pitch with AI",
      icon: "📈",
      buttonText: "Pitch Now"
    },
    {
      title: "MyEvents World",
      subtitle: "Community events every Saturday & Sunday",
      icon: "🎤",
      buttonText: "View Events"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {worlds.map((world, index) => (
            <Card key={index} className="card-gradient card-hover group text-center p-8 border-2 border-primary/10 hover:border-primary/30">
              <CardHeader className="pb-6">
                <div className="text-6xl mb-4 group-hover:animate-bounce">
                  {world.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-3">
                  {world.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {world.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {world.link ? (
                  <Button variant="outline" className="w-full font-semibold" asChild>
                    <a href={world.link}>{world.buttonText}</a>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full font-semibold">
                    {world.buttonText}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorldsSection;