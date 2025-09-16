import { Button } from "@/components/ui/button";
import { Mic, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-background py-[120px] overflow-hidden">
      {/* Subtle gradient overlay at edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-gradient-to-t from-primary/3 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-6">
            Speak Your Mind
          </h1>
          
          {/* Tagline */}
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
            Prepare • Practice • Perform
          </h2>
          
          {/* Subtext */}
          <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
            The safe place for your speaking!
          </h3>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/debate">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                <Mic className="w-5 h-5 mr-3" />
                Start Practicing 🎤
              </Button>
            </Link>
            
            <Link to="/events">
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Explore Events 📅
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;