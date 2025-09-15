import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: "MyDebateWorld", href: "/debate" },
      { name: "MyInterviewWorld", href: "/interview" },
      { name: "MyPitchWorld", href: "/pitch" },
      { name: "Events", href: "/events" }
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Success Stories", href: "/success-stories" },
      { name: "Contact", href: "/contact" }
    ],
    Resources: [
      { name: "Speaking Tips", href: "/tips" },
      { name: "Practice Library", href: "/library" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-b from-primary to-primary-alt text-white">
      <div className="section-content py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-hero text-3xl mb-4">
                Speak Your Mind
              </h3>
              <p className="font-tagline text-xl italic text-white/80 mb-4">
                Prepare, Practice & Perform
              </p>
              <p className="font-body text-white/70 leading-relaxed">
                Empowering students and professionals to become confident, compelling communicators through AI-powered practice and personalized coaching.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="font-ui font-semibold text-lg">Stay Updated</h4>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <button className="btn-emerald px-6 py-3 rounded-xl font-ui text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-ui font-semibold text-lg">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="font-body text-white/70 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="font-body text-white/70">
              © 2024 Speak Your Mind. All rights reserved. Made with ❤️ for speakers worldwide.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Fun Footer Message */}
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <p className="font-ui text-white/60 text-sm">
            🎤 Keep practicing, keep improving, keep speaking your mind! 🌟
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;