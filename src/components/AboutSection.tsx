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
    <section className="section-padding bg-background">
      <div className="section-content">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-heading text-5xl md:text-6xl gradient-text leading-tight">
                Transforming Speakers, One Voice at a Time
              </h2>
              <p className="font-body text-xl text-muted-foreground leading-relaxed">
                At Speak Your Mind, we believe every student has the potential to be a powerful communicator. 
                Our AI-powered platform provides personalized coaching that adapts to your unique style and pace.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                "🎯 Personalized AI coaching tailored to your needs",
                "🏆 Real-time feedback with actionable improvements", 
                "🌟 Practice with realistic scenarios and competitions",
                "🚀 Track your progress and celebrate milestones"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-body text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button className="btn-primary text-xl px-8 py-4 rounded-2xl group">
                Join the Movement
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>

          {/* Stats Side */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="card-modern text-center hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-heading text-3xl md:text-4xl gradient-text-purple mb-2">
                    {stat.value}
                  </div>
                  <div className="font-ui text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Success Story Quote */}
            <div className="card-modern bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="space-y-4">
                <div className="text-4xl">💬</div>
                <p className="font-body italic text-lg text-muted-foreground">
                  "Speak Your Mind transformed my confidence completely. I went from being terrified of public speaking to winning the national debate championship!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-ui font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-ui font-semibold">Ananya Sharma</div>
                    <div className="font-body text-sm text-muted-foreground">Delhi University, Debate Champion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20 space-y-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading text-3xl md:text-4xl mb-6">
              Ready to unlock your speaking potential?
            </h3>
            <p className="font-body text-lg text-muted-foreground mb-8">
              Join thousands of students who have already transformed their communication skills with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary text-lg px-8 py-4 rounded-2xl">
                Start Free Trial
              </Button>
              <Button className="btn-secondary text-lg px-8 py-4 rounded-2xl border-primary">
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;