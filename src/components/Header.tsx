import { Button } from "@/components/ui/button";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                <span className="font-ui text-sm">Back home</span>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-foreground font-heading">MyDebate.ai</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Home
            </Link>
            <Link to="/debate" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              MyDebate World
            </Link>
            <Link to="/interview" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              MyInterview World
            </Link>
            <Link to="/pitch" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              MyPitch World
            </Link>
            <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Events
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Dashboard
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="font-ui bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link to="/debate" className="text-foreground hover:text-primary transition-colors font-medium">
                MyDebate World
              </Link>
              <Link to="/interview" className="text-foreground hover:text-primary transition-colors font-medium">
                MyInterview World
              </Link>
              <Link to="/pitch" className="text-foreground hover:text-primary transition-colors font-medium">
                MyPitch World
              </Link>
              <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium">
                Events
              </Link>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                Dashboard
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 pt-4">
              <Button className="justify-start bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;