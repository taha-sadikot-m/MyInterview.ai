import { Linkedin, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="hero-gradient py-16">
      <div className="section-content">
        <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading text-white">
              Speak Your Mind
            </h3>
            <p className="text-white/80 font-tagline">
              Prepare, Practice & Perform
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-white/90 font-ui">
            <a href="/" className="hover:text-white transition-colors hover:underline">
              Home
            </a>
            <a href="/debate" className="hover:text-white transition-colors hover:underline">
              Worlds
            </a>
            <a href="/events" className="hover:text-white transition-colors hover:underline">
              Events
            </a>
            <a href="#about" className="hover:text-white transition-colors hover:underline">
              About
            </a>
            <a href="#contact" className="hover:text-white transition-colors hover:underline">
              Contact
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-4">
            <a href="#" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-white/70 font-body">
            © 2025 Speak Your Mind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;