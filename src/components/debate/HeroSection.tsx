import { Button } from "@/components/ui/button";
import { Mic, BookOpen, Trophy } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="hero-modern">
      <div className="section-content relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-hero text-6xl md:text-7xl lg:text-8xl mb-6 text-white">
            Debate World — Be Ivy League Ready
          </h1>
          <p className="font-tagline text-2xl md:text-3xl text-white/95 mb-16">
            Learn, Practice & Compete in Debates, MUNs, and School Events.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="min-w-[280px] h-16 bg-gradient-to-r from-white to-white/90 text-primary hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              <Mic className="w-6 h-6 mr-3" />
              Debate with Chanakya
            </Button>
            
            <Button 
              variant="hero" 
              size="lg" 
              className="min-w-[280px] h-16 bg-gradient-to-r from-white/20 to-white/10 border-2 border-white/40 text-white hover:bg-white/30 hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              MUN 101
            </Button>
            
            <Button 
              variant="hero" 
              size="lg" 
              className="min-w-[280px] h-16 bg-gradient-to-r from-white/20 to-white/10 border-2 border-white/40 text-white hover:bg-white/30 hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              <Trophy className="w-6 h-6 mr-3" />
              School Events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};