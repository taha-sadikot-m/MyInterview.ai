import { Button } from "@/components/ui/button";
import { useState } from "react";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <section className="hero-indigo min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 font-heading">
            <span className="gradient-text">MyDebate.ai</span>
          </h1>
          
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground font-heading">
              Empowering the speaking super star in you!
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium font-body italic">
              Prepare. Practice. Perform.
            </p>
          </div>

          <div className="pt-8">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => setIsSignupOpen(true)}
              className="font-ui"
            >
              Start Your Journey 🚀
            </Button>
          </div>
          </div>
        </div>
      </section>

      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
      />
    </>
  );
};

export default HeroSection;