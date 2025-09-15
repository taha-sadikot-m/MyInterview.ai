import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="section-padding bg-accent/50">
      <div className="section-content">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground">
            About <span className="gradient-text">Speak Your Mind</span>
          </h2>
          
          <p className="text-xl md:text-2xl font-body text-muted-foreground leading-relaxed">
            Empowering students to master the art of communication with AI-powered practice. 
            Transform your speaking skills through personalized feedback, realistic simulations, 
            and confidence-building exercises.
          </p>

          <div className="pt-6">
            <Button className="button-primary text-lg px-8 py-4 group">
              Join the Movement
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;