import { Button } from "@/components/ui/button";
import { Mic, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-primary relative min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-7xl mx-auto space-y-16">
          {/* Brand Name + Tagline */}
          <div className="space-y-8">
            <h1 className="font-logo text-7xl md:text-9xl lg:text-[12rem] text-white leading-none tracking-tight animate-scale-in">
              Speak Your Mind
            </h1>
            <p className="font-tagline text-4xl md:text-5xl lg:text-6xl text-white/95">
              Prepare, Practice & Perform
            </p>
            <p className="font-body text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Master communication with Gen-Z style AI coaching. From debates to interviews to pitch presentations — 
              become confident, compelling, and world-ready! ✨
            </p>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <Link to="/debate">
              <Button className="btn-primary text-2xl px-12 py-8 min-w-[350px] rounded-3xl font-ui transform hover:scale-110 transition-all duration-500">
                <Mic className="w-8 h-8 mr-4" />
                Start Practicing 🎤
              </Button>
            </Link>
            
            <Link to="/events">
              <Button className="btn-outline-primary text-2xl px-12 py-8 min-w-[350px] rounded-3xl font-ui transform hover:scale-110 transition-all duration-500">
                <Calendar className="w-8 h-8 mr-4" />
                Explore Events 📅
              </Button>
            </Link>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              "🏆 10,000+ Students",
              "🎯 98% Success Rate", 
              "🌟 AI-Powered Coaching",
              "🚀 Real-time Feedback"
            ].map((badge, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 group"
              >
                <span className="font-ui text-white font-semibold text-lg group-hover:scale-110 transition-transform duration-300 block">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-white/15 to-white/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-24 w-28 h-28 bg-gradient-to-br from-white/20 to-white/5 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
    </section>
  );
};

export default HeroSection;