import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Brain, Trophy, Users } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Students Trained" },
    { icon: Mic, value: "50,000+", label: "Practice Sessions" },
    { icon: Brain, value: "98%", label: "Success Rate" },
    { icon: Trophy, value: "100+", label: "Competitions Won" }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content Side */}
          <div className="space-y-10">
            <div className="space-y-8">
              <h2 className="font-heading text-6xl md:text-7xl gradient-text-accent leading-tight">
                Transforming Speakers, One Voice at a Time
              </h2>
              <p className="font-body text-2xl text-foreground/80 leading-relaxed">
                At Speak Your Mind, we believe every Gen-Z student has the potential to be a powerful communicator. 
                Our AI-powered platform provides personalized coaching that adapts to your unique vibe and pace! ✨
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {[
                "🎯 Personalized AI coaching tailored to your Gen-Z style",
                "🏆 Real-time feedback with actionable improvements", 
                "🌟 Practice with realistic scenarios and competitions",
                "🚀 Track your progress and celebrate epic milestones"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl hover:bg-white/70 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-secondary to-secondary-emerald rounded-full animate-pulse"></div>
                  <span className="font-body text-foreground/80 text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Button className="btn-accent text-2xl px-12 py-6 rounded-3xl font-ui group">
                Join the Movement
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>

          {/* Stats Side */}
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="card-genz text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-electric rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="font-heading text-4xl md:text-5xl gradient-text mb-3">
                    {stat.value}
                  </div>
                  <div className="font-ui text-foreground/70 text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Success Story Quote */}
            <div className="card-genz bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <div className="space-y-6">
                <div className="text-6xl animate-bounce">💬</div>
                <p className="font-body italic text-xl text-foreground/80 leading-relaxed">
                  "Speak Your Mind transformed my confidence completely! I went from being terrified of public speaking to winning the national debate championship! Absolutely life-changing! 🔥"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-emerald to-secondary rounded-full flex items-center justify-center text-white font-ui font-bold text-xl">
                    A
                  </div>
                  <div>
                    <div className="font-ui font-bold text-lg gradient-text">Ananya Sharma</div>
                    <div className="font-body text-foreground/60">Delhi University, Debate Champion 🏆</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-24 space-y-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-heading text-5xl md:text-6xl mb-8 gradient-text">
              Ready to unlock your speaking superpowers?
            </h3>
            <p className="font-body text-xl text-foreground/80 mb-10 leading-relaxed">
              Join thousands of Gen-Z students who have already transformed their communication skills with our AI-powered platform! 🚀
            </p>
            <div className="flex flex-col lg:flex-row gap-6 justify-center">
              <Button className="btn-primary text-2xl px-12 py-6 rounded-3xl font-ui">
                Start Free Trial ✨
              </Button>
              <Button className="btn-outline-primary text-2xl px-12 py-6 rounded-3xl font-ui">
                Watch Demo Video 🎬
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;