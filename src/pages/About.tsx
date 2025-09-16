import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Handshake, MessageCircle } from "lucide-react";

const About = () => {
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
              About Speak Your Mind
            </h1>
            
            {/* Tagline */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
              Empowering the next generation of confident speakers
            </h2>
            
            {/* Subtext */}
            <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
              From debate arenas to investor pitches, we are building the world's first AI-powered safe space for speaking.
            </h3>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                🚀 Join the Movement
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                👥 Meet the Team
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                🤝 Partner with Us
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
              >
                📩 Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="font-body text-xl text-foreground max-w-3xl mx-auto">
              We believe every voice deserves to be heard. Our mission is to democratize communication skills 
              through AI-powered practice and feedback, making world-class training accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border rounded-2xl">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl text-foreground">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground">
                  Making premium communication training available to students worldwide, 
                  regardless of their location or background.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border rounded-2xl">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl text-foreground">Safe Space</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground">
                  Creating a judgment-free environment where learners can practice, 
                  fail, and improve without fear of embarrassment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border rounded-2xl">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl text-foreground">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground">
                  Delivering world-class AI feedback and training methodologies 
                  that match top communication coaches and institutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-8">Our Story</h2>
            <div className="space-y-6 font-body text-lg text-foreground">
              <p>
                Speak Your Mind was born from a simple observation: the best speakers in the world 
                aren't necessarily the most talented—they're the ones who practiced the most in 
                safe, supportive environments.
              </p>
              <p>
                Founded by a team of educators, technologists, and communication experts, we recognized 
                that traditional training methods were expensive, inaccessible, and often intimidating 
                for beginners.
              </p>
              <p className="font-fancy italic text-xl">
                "What if we could give every student access to a personal communication coach, 
                available 24/7, that never judges and always encourages growth?"
              </p>
              <p>
                Today, thousands of students worldwide use our platform to prepare for debates, 
                nail job interviews, and pitch their ideas with confidence. We're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
              Ready to Find Your Voice?
            </h2>
            <p className="font-body text-xl text-foreground mb-8">
              Join our community of confident speakers and start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 rounded-2xl font-medium"
              >
                🚀 Join the Movement
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 rounded-2xl font-medium"
              >
                📩 Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;