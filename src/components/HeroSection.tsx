import { Button } from "@/components/ui/button";
import { useState } from "react";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <section className="hero-modern min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-hero text-white leading-tight">
                Speak Your Mind
              </h1>
              <p className="text-2xl md:text-3xl lg:text-4xl font-tagline text-white/90">
                Prepare, Practice & Perform
              </p>
              <p className="text-xl md:text-2xl text-white/80 font-body max-w-3xl mx-auto">
                Speak with confidence. Lead with impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                onClick={() => setIsSignupOpen(true)}
                className="button-primary text-lg px-8 py-4 min-w-[250px]"
              >
                Start Practicing 🎤
              </Button>
              <Button 
                variant="outline"
                className="button-secondary text-lg px-8 py-4 min-w-[250px] border-white text-white hover:bg-white hover:text-primary"
              >
                Explore Events 📅
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