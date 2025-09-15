import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-heading font-bold">MySpeech.ai</span>
            </div>
            <p className="text-muted-foreground text-sm">
              The world's first AI-powered speech simulator. Transform your speaking skills with cutting-edge technology.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/20">
                <Twitter size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/20">
                <Linkedin size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/20">
                <Github size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/20">
                <Mail size={18} />
              </Button>
            </div>
          </div>

          {/* Worlds */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Worlds</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  MyDebateWorld
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  MyInterviewWorld
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  MyPitch.ai
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Global Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Coaching Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1 mb-4 md:mb-0">
            <span>© 2024 MySpeech.ai. Made with</span>
            <Heart size={16} className="text-primary fill-current" />
            <span>for speakers worldwide.</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;