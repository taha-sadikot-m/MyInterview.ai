import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyDebateWorld from "./pages/MyDebateWorld";
import MyInterviewWorld from "./pages/MyInterviewWorld";
import MyPitchWorld from "./pages/MyPitchWorld";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "@fontsource/poppins/700.css";
import "@fontsource/inter/600.css";

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
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
