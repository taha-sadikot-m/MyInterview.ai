import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/debate/HeroSection";
import { MunSection } from "@/components/debate/MunSection";
import { DebatePracticeSection } from "@/components/debate/DebatePracticeSection";
import { SchoolEventsSection } from "@/components/debate/SchoolEventsSection";
import { GSLSpeechSection } from "@/components/debate/GSLSpeechSection";
import { GenZTopicsSection } from "@/components/debate/GenZTopicsSection";

const MyDebateWorld = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MunSection />
      <DebatePracticeSection />
      <SchoolEventsSection />
      <GSLSpeechSection />
      <GenZTopicsSection />
      <Footer />
    </div>
  );
};

export default MyDebateWorld;