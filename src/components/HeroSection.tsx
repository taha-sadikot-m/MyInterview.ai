import { Button } from "@/components/ui/button";
import { useState } from "react";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <section className="hero-gradient min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl lg:text-8xl font-black mb-6">
              <span className="gradient-text">MyDebate.ai</span>
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                Empowering the speaking super star in you!
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                Prepare. Practice. Perform.
              </p>
            </div>

            <div className="pt-8">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setIsSignupOpen(true)}
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