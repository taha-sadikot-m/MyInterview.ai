import { Button } from "@/components/ui/button";
import { Play, Sparkles, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-speech.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="AI-powered speech coaching"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-success/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="text-yellow-300 animate-pulse-glow" size={32} />
            <span className="text-lg font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              World's First AI Speech Simulator
            </span>
            <Sparkles className="text-yellow-300 animate-pulse-glow" size={32} />
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-slide-up">
            Become a Speaking
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
              Super Star
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-slide-up">
            Master debates, ace interviews, and perfect your pitches with AI-powered coaching.
            Train with virtual opponents, practice with mock interviewers, and pitch to AI investors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-scale-in">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <Play className="mr-2" size={24} />
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Users className="mr-2" size={24} />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm opacity-80">Speakers Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-80">AI Coaching</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Zap className="text-yellow-300" size={24} />
        </div>
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: "1s" }}>
        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Users className="text-blue-300" size={28} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;