const Footer = () => {
  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors font-ui">
              About
            </a>
            <a href="#" className="hover:text-primary transition-colors font-ui">
              Contact
            </a>
            <a href="#" className="hover:text-primary transition-colors font-ui">
              Terms
            </a>
          </div>
          <div className="text-sm text-muted-foreground font-body">
            © 2025 MyDebate.ai – Powered by MySpeech.ai
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;