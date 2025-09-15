import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WorldsSection from "@/components/WorldsSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <WorldsSection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default Index;
