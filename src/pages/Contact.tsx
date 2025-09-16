import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, Calendar } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-background py-[120px] overflow-hidden">
        {/* Subtle gradient overlay at edges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/5 to-transparent"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-gradient-to-t from-primary/3 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Headline */}
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-6">
              Contact Us
            </h1>
            
            {/* Tagline */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
              We'd love to hear from you
            </h2>
            
            {/* Subtext */}
            <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
              Reach out for collaborations, partnerships, or support.
            </h3>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                💌 Send Message
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                ✉️ Email Us
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                💬 WhatsApp Us
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                📅 Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 border rounded-2xl">
              <CardHeader>
                <CardTitle className="font-heading text-3xl font-bold text-foreground mb-4">
                  Send us a message
                </CardTitle>
                <CardDescription className="font-body text-lg text-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-ui text-sm font-medium text-foreground">First Name</label>
                    <Input 
                      placeholder="Your first name" 
                      className="border-2 border-primary/20 focus:border-primary rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-ui text-sm font-medium text-foreground">Last Name</label>
                    <Input 
                      placeholder="Your last name" 
                      className="border-2 border-primary/20 focus:border-primary rounded-xl h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-ui text-sm font-medium text-foreground">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="border-2 border-primary/20 focus:border-primary rounded-xl h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-ui text-sm font-medium text-foreground">Subject</label>
                  <Input 
                    placeholder="What's this about?" 
                    className="border-2 border-primary/20 focus:border-primary rounded-xl h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-ui text-sm font-medium text-foreground">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..." 
                    rows={6}
                    className="border-2 border-primary/20 focus:border-primary rounded-xl resize-none"
                  />
                </div>
                
                <Button 
                  size="lg" 
                  className="btn-primary w-full text-lg py-4 rounded-xl font-medium"
                >
                  💌 Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  Get in touch
                </h2>
                <p className="font-body text-lg text-foreground mb-8">
                  Whether you're a student, educator, or institution, we're here to help you 
                  transform communication skills with AI-powered training.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold text-foreground">Email Us</h4>
                      <p className="font-body text-foreground">hello@speakyourmind.ai</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold text-foreground">WhatsApp</h4>
                      <p className="font-body text-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold text-foreground">Book a Demo</h4>
                      <p className="font-body text-foreground">Schedule a personalized demo</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold text-foreground">Partnerships</h4>
                      <p className="font-body text-foreground">partners@speakyourmind.ai</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                <h4 className="font-ui font-semibold text-foreground mb-3">Office Hours</h4>
                <div className="space-y-2 font-body text-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-body text-lg text-foreground">
              Quick answers to common questions about our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 border rounded-xl">
              <h4 className="font-ui font-semibold text-foreground mb-3">
                How does AI coaching work?
              </h4>
              <p className="font-body text-foreground">
                Our AI analyzes your speech patterns, content, and delivery to provide 
                personalized feedback on areas like clarity, confidence, and persuasiveness.
              </p>
            </Card>

            <Card className="p-6 border rounded-xl">
              <h4 className="font-ui font-semibold text-foreground mb-3">
                Is there a free trial?
              </h4>
              <p className="font-body text-foreground">
                Yes! You can try basic features for free. Premium plans offer advanced 
                feedback, unlimited practice, and exclusive content.
              </p>
            </Card>

            <Card className="p-6 border rounded-xl">
              <h4 className="font-ui font-semibold text-foreground mb-3">
                Do you offer institutional licenses?
              </h4>
              <p className="font-body text-foreground">
                Absolutely! We provide bulk licenses for schools, colleges, and organizations 
                with custom features and dedicated support.
              </p>
            </Card>

            <Card className="p-6 border rounded-xl">
              <h4 className="font-ui font-semibold text-foreground mb-3">
                How secure is my data?
              </h4>
              <p className="font-body text-foreground">
                We use enterprise-grade encryption and never share your practice sessions 
                or personal data with third parties.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;