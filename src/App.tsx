import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyDebateWorld from "./pages/MyDebateWorld";
import MyInterviewWorld from "./pages/MyInterviewWorld";
import MyPitchWorld from "./pages/MyPitchWorld";
import Events from "./pages/Events";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Enquire from "./pages/Enquire";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/debate" element={<MyDebateWorld />} />
        <Route path="/interview" element={<MyInterviewWorld />} />
        <Route path="/pitch" element={<MyPitchWorld />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/enquire" element={<Enquire />} />
        <Route path="/premium" element={<Premium />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
