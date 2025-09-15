import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold gradient-text font-heading">MyDebate.ai</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Home
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              About US
            </a>
            <a href="#signin" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Sign In
            </a>
            <a href="#enquiry" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Enquiry
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="default" className="font-ui">
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
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
                About US
              </a>
              <a href="#signin" className="text-foreground hover:text-primary transition-colors font-medium">
                Sign In
              </a>
              <a href="#enquiry" className="text-foreground hover:text-primary transition-colors font-medium">
                Enquiry
              </a>
            </nav>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="default" className="justify-start">
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