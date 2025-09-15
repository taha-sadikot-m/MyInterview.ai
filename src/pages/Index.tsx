import HeroSection from "@/components/HeroSection";
import WorldsSection from "@/components/WorldsSection";
import EventsSection from "@/components/EventsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WorldsSection />
      <EventsSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;