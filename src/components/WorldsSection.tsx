import { Button } from "@/components/ui/button";
import { Zap, Briefcase, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const WorldsSection = () => {
  const worlds = [
    {
      title: "MyDebateWorld",
      description: "Master the art of persuasive speaking and logical argumentation with AI-powered debate coaching.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      link: "/debate",
      features: ["MUN Training", "School Debates", "Real-time Scoring", "AI Judge Feedback"]
    },
    {
      title: "MyInterviewWorld", 
      description: "Ace any interview with personalized AI coaching and realistic practice scenarios.",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      link: "/interview",
      features: ["Mock Interviews", "Industry Questions", "Body Language Tips", "Confidence Building"]
    },
    {
      title: "MyPitchWorld",
      description: "Perfect your pitch delivery and win over any audience with compelling storytelling.",
      icon: Rocket,
      color: "from-emerald-500 to-emerald-600", 
      link: "/pitch",
      features: ["Startup Pitches", "Sales Presentations", "Storytelling", "Investor Ready"]
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-heading text-5xl md:text-7xl mb-6 gradient-text">
            Choose Your World
          </h2>
          <p className="font-body text-xl text-foreground/80 max-w-4xl mx-auto">
            Pick your speaking superpower and start your journey to become a confident, compelling communicator.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {worlds.map((world, index) => (
            <div
              key={index}
              className="card-world group cursor-pointer relative"
            >
              {/* Icon Section */}
              <div className="text-center mb-8 relative z-10">
                <div className={`w-28 h-28 bg-gradient-to-br ${world.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl`}>
                  <world.icon className="w-14 h-14 text-white" />
                </div>
                <div className="flex justify-center mb-4">
                  <span className="text-5xl animate-bounce">⚡</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-6 relative z-10">
                <h3 className="font-heading text-3xl md:text-4xl gradient-text">
                  {world.title}
                </h3>
                <p className="font-body text-foreground/70 leading-relaxed text-lg">
                  {world.description}
                </p>

                {/* Features */}
                <div className="space-y-4">
                  {world.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center gap-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-primary-electric to-primary-neon rounded-full animate-pulse"></div>
                      <span className="font-ui text-sm text-foreground/80 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-8">
                  <Link to={world.link}>
                    <Button className="btn-secondary w-full text-lg py-6 rounded-2xl font-ui">
                      {world.title === "MyDebateWorld" && "Enter Debate Arena"}
                      {world.title === "MyInterviewWorld" && "Start Interview Practice"}
                      {world.title === "MyPitchWorld" && "Pitch Like a Pro"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-24">
          <p className="font-body text-xl text-foreground/80 mb-8">
            Not sure where to start? Take our quick assessment!
          </p>
          <Button className="btn-accent text-xl px-12 py-6 rounded-2xl font-ui">
            Find My Perfect World 🎯
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorldsSection;