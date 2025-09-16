import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Target, Presentation, Users, Calendar } from "lucide-react";

interface ServicesSectionProps {
  className?: string;
  showHero?: boolean;
}

const ServicesSection = ({ className = "", showHero = true }: ServicesSectionProps) => {
  const services = [
    {
      title: "1-on-1 Debate Coaching",
      subtitle: "Improve speech structure, rebuttal, delivery, and confidence.",
      icon: MessageSquare,
      cta: "Book Now",
      href: "/enquire"
    },
    {
      title: "1-on-1 Interview Coaching", 
      subtitle: "Practice HR & technical rounds with recruiter-style feedback.",
      icon: Target,
      cta: "Book Now",
      href: "/enquire"
    },
    {
      title: "1-on-1 Pitch Training",
      subtitle: "Simulate investor panels, refine decks, and get actionable critique.",
      icon: Presentation,
      cta: "Book Now", 
      href: "/enquire"
    },
    {
      title: "School/College Workshops",
      subtitle: "Bring public speaking, MUNs, and interview prep to your campus.",
      icon: Users,
      cta: "Enquire",
      href: "/enquire"
    }
  ];

  return (
    <div className={className}>
      {showHero && (
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="font-body text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Personalized training to sharpen your debate, interview, and pitch skills.
            </p>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={index}
                  className="card-modern group hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-2xl font-bold text-foreground">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="font-body text-lg text-muted-foreground">
                      {service.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-ui py-3 rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-300"
                      asChild
                    >
                      <a href={service.href}>{service.cta}</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Weekly Class Banner */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Weekly Live Public Speaking Class — Every Saturday 5 PM IST
                </h3>
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-ui px-8 py-3 rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-300"
                asChild
              >
                <a href="/enquire">Join Now</a>
              </Button>
            </Card>
          </div>

          {/* Contact Footer */}
          <div className="mt-12 text-center">
            <p className="font-body text-lg text-muted-foreground mb-6">
              Ready to transform your communication skills?
            </p>
            <Button 
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-ui px-8 py-3 rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/enquire">Get Started Today</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;