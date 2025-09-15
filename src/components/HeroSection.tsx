import { Button } from "@/components/ui/button";
import { Mic, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-modern relative min-h-screen flex items-center justify-center">
      <div className="section-content relative z-10">
        <div className="text-center max-w-6xl mx-auto space-y-12">
          {/* Brand Name + Tagline */}
          <div className="space-y-8">
            <h1 className="font-hero text-6xl md:text-8xl lg:text-9xl text-white leading-tight bounce-in">
              Speak Your Mind
            </h1>
            <p className="font-tagline text-3xl md:text-4xl text-white/95 italic">
              Prepare, Practice & Perform
            </p>
            <p className="font-body text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Master speaking skills with AI-powered practice. Debate, Interview & Pitch like a pro!
            </p>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
            <Link to="/debate">
              <Button 
                size="lg" 
                className="btn-primary text-xl px-10 py-6 min-w-[280px] rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <Mic className="w-6 h-6 mr-3" />
                Start Practicing 🎤
              </Button>
            </Link>
            
            <Link to="/events">
              <Button 
                size="lg" 
                className="btn-secondary text-xl px-10 py-6 min-w-[280px] rounded-2xl border-white/60 text-white hover:bg-white/20 hover:border-white transition-all duration-300"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Explore Events 📅
              </Button>
            </Link>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-12">
            {[
              "🏆 10,000+ Students Trained",
              "🎯 98% Success Rate",
              "🌟 AI-Powered Coaching",
              "🚀 Real-time Feedback"
            ].map((badge, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <span className="font-ui text-white font-semibold">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
    </section>
  );
};

export default HeroSection;