import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageSquare, Target, Clock, Users, Star } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-modern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-alt"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Personalized 1-on-1 Training
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get expert guidance tailored to you.
          </p>
          <Badge className="bg-white/20 text-white text-lg px-4 py-2">
            Transform Your Communication Skills
          </Badge>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Debate Coaching */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-primary/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-bold mb-4">Debate Coaching</h2>
                <p className="font-body text-lg text-muted-foreground">
                  Personalized speech & debate preparation with expert trainers
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">MUN Training</h4>
                    <p className="font-body text-sm text-muted-foreground">Master Model UN procedures, research, and diplomatic speaking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">Parliamentary Debate</h4>
                    <p className="font-body text-sm text-muted-foreground">Learn structured argumentation and rapid response techniques</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">School Events</h4>
                    <p className="font-body text-sm text-muted-foreground">Excel in elocution, extempore, and assembly presentations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">Personalized Feedback</h4>
                    <p className="font-body text-sm text-muted-foreground">Detailed analysis of delivery, content, and confidence</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-ui font-semibold">Session Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-ui font-medium">Duration</p>
                    <p className="font-body text-muted-foreground">60 minutes</p>
                  </div>
                  <div>
                    <p className="font-ui font-medium">Format</p>
                    <p className="font-body text-muted-foreground">Online/In-person</p>
                  </div>
                  <div>
                    <p className="font-ui font-medium">Materials</p>
                    <p className="font-body text-muted-foreground">Included</p>
                  </div>
                  <div>
                    <p className="font-ui font-medium">Recording</p>
                    <p className="font-body text-muted-foreground">Available</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-ui py-3">
                Book Debate Coaching
              </Button>
            </Card>

            {/* Interview Coaching */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-accent/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-accent" />
                </div>
                <h2 className="font-heading text-3xl font-bold mb-4">Interview Coaching</h2>
                <p className="font-body text-lg text-muted-foreground">
                  Mock HR + technical interviews with detailed feedback
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">Campus Placement Prep</h4>
                    <p className="font-body text-sm text-muted-foreground">Tailored preparation for top company interviews</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">Technical Interviews</h4>
                    <p className="font-body text-sm text-muted-foreground">Practice coding, case studies, and technical questions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">HR Round Mastery</h4>
                    <p className="font-body text-sm text-muted-foreground">Perfect your behavioral responses and storytelling</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-ui font-semibold">STAR Method Training</h4>
                    <p className="font-body text-sm text-muted-foreground">Structure compelling answers with proven frameworks</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="font-ui font-semibold">What's Included</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-body">Mock Interview</span>
                    <span className="font-ui text-accent">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body">Detailed Feedback Report</span>
                    <span className="font-ui text-accent">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body">Resume Review</span>
                    <span className="font-ui text-accent">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body">Follow-up Session</span>
                    <span className="font-ui text-accent">✓</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-white font-ui py-3">
                Book Interview Coaching
              </Button>
            </Card>
          </div>

          {/* Testimonials */}
          <div className="mt-20">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">What Our Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-body text-muted-foreground mb-4">
                  "The debate coaching helped me win the inter-college MUN. The trainer's feedback was incredibly detailed and actionable."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-ui font-semibold text-primary">A</span>
                  </div>
                  <div>
                    <p className="font-ui font-semibold">Arjun Sharma</p>
                    <p className="font-body text-sm text-muted-foreground">DU Student</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-body text-muted-foreground mb-4">
                  "Cracked my dream job at Google! The interview coaching sessions were game-changing. Highly recommend."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="font-ui font-semibold text-accent">P</span>
                  </div>
                  <div>
                    <p className="font-ui font-semibold">Priya Patel</p>
                    <p className="font-body text-sm text-muted-foreground">IIT Graduate</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-body text-muted-foreground mb-4">
                  "From a shy student to a confident speaker. The personalized approach made all the difference."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="font-ui font-semibold text-secondary">R</span>
                  </div>
                  <div>
                    <p className="font-ui font-semibold">Rahul Verma</p>
                    <p className="font-body text-sm text-muted-foreground">MBA Student</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl font-bold mb-6">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="font-body text-xl text-white/90 mb-8">
            Book your personalized coaching session today and transform your communication skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-ui px-8 py-4">
              Schedule Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-ui px-8 py-4">
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;