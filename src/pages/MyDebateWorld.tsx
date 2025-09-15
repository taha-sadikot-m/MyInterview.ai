import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/debate/HeroSection";
import { MunSection } from "@/components/debate/MunSection";
import { DebatePracticeSection } from "@/components/debate/DebatePracticeSection";
import { SchoolEventsSection } from "@/components/debate/SchoolEventsSection";
import { GSLSpeechSection } from "@/components/debate/GSLSpeechSection";
import { GenZTopicsSection } from "@/components/debate/GenZTopicsSection";

const MyDebateWorld = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <MunSection />
      <DebatePracticeSection />
      <SchoolEventsSection />
      <GSLSpeechSection />
      <GenZTopicsSection />
    </div>
  );
};

export default MyDebateWorld;