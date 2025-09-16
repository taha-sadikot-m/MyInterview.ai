import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import symLogo from "@/assets/sym-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const enquireOptions = [
    { label: "Student", href: "/enquire?type=student" },
    { label: "Parent", href: "/enquire?type=parent" },
    { label: "Educator", href: "/enquire?type=educator" },
    { label: "Trainer", href: "/enquire?type=trainer" }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[hsl(var(--nav-background))] to-[hsl(var(--primary-dark))] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={symLogo} 
              alt="Speak Your Mind Logo" 
              className="h-10 w-10 rounded-full"
            />
            <span className="font-brand text-xl text-white">
              Speak Your Mind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-ui px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              to="/debate"
              className={`font-ui px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/debate")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              MyDebate
            </Link>
            <Link
              to="/interview"
              className={`font-ui px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/interview")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              MyInterview
            </Link>
            <Link
              to="/pitch"
              className={`font-ui px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/pitch")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              MyPitch
            </Link>

            {/* Enquire Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-ui text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-1"
                >
                  Enquire <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200">
                {enquireOptions.map((option) => (
                  <DropdownMenuItem key={option.label} asChild>
                    <Link
                      to={option.href}
                      className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 font-ui"
                    >
                      {option.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/services"
              className={`font-ui px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/services")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Services
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[hsl(var(--primary-dark))] border-t border-white/20">
              <Link
                to="/"
                className="font-ui block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/debate"
                className="font-ui block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                MyDebate
              </Link>
              <Link
                to="/interview"
                className="font-ui block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                MyInterview
              </Link>
              <Link
                to="/pitch"
                className="font-ui block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                MyPitch
              </Link>
              <div className="px-3 py-2">
                <div className="text-white/60 text-sm font-ui mb-2">Enquire</div>
                {enquireOptions.map((option) => (
                  <Link
                    key={option.label}
                    to={option.href}
                    className="font-ui block px-3 py-1 text-sm text-white/80 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
              <Link
                to="/services"
                className="font-ui block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;