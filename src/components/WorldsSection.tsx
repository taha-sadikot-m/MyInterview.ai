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
    <section className="section-padding bg-background">
      <div className="section-content">
        <div className="text-center mb-20">
          <h2 className="font-heading text-5xl md:text-7xl mb-6 gradient-text">
            Choose Your World
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-4xl mx-auto">
            Pick your speaking superpower and start your journey to become a confident, compelling communicator.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {worlds.map((world, index) => (
            <div
              key={index}
              className="card-world group cursor-pointer hover:shadow-2xl relative overflow-hidden"
            >
              {/* Icon Section */}
              <div className="text-center mb-8">
                <div className={`w-24 h-24 bg-gradient-to-br ${world.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <world.icon className="w-12 h-12 text-white" />
                </div>
                <div className="flex justify-center mb-4">
                  <span className="text-4xl">⚡</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-6">
                <h3 className="font-heading text-2xl md:text-3xl gradient-text-purple">
                  {world.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {world.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {world.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="font-ui text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <Link to={world.link}>
                    <Button className="btn-emerald w-full text-lg py-6 rounded-2xl font-ui">
                      {world.title === "MyDebateWorld" && "Enter Debate Arena"}
                      {world.title === "MyInterviewWorld" && "Start Interview Practice"}
                      {world.title === "MyPitchWorld" && "Pitch Like a Pro"}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="font-body text-lg text-muted-foreground mb-8">
            Not sure where to start? Take our quick assessment!
          </p>
          <Button className="btn-orange text-lg px-8 py-4 rounded-2xl">
            Find My Perfect World 🎯
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorldsSection;