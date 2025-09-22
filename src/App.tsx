import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/components/auth/LoginPage";
import RegisterPage from "@/components/auth/RegisterPage";
import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";
import AuthCallback from "@/components/auth/AuthCallback";
import EmailVerification from "@/components/auth/EmailVerification";
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to interview page */}
          <Route path="/" element={<Navigate to="/interview" replace />} />
          
          {/* Public routes */}
          <Route path="/home" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/enquire" element={<Enquire />} />
          <Route path="/premium" element={<Premium />} />
          
          {/* Authentication routes - only accessible when NOT logged in */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <RegisterPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPasswordPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ResetPasswordPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Auth callback for email confirmations */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Email verification route */}
          <Route path="/auth/verify-email" element={<EmailVerification />} />

          {/* Interview page - accessible without login, but auth required for interactions */}
          <Route path="/interview" element={<MyInterviewWorld />} />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/debate" 
            element={
              <ProtectedRoute>
                <MyDebateWorld />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pitch" 
            element={
              <ProtectedRoute>
                <MyPitchWorld />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
