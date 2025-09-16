import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  CheckCircle, 
  Zap, 
  Target, 
  Rocket,
  Star,
  Award,
  Clock,
  Users,
  Video,
  FileText,
  Mic
} from "lucide-react";

const Premium = () => {
  const premiumFeatures = {
    debate: [
      { icon: Video, title: "Live MUN Simulations", description: "Real-time Model UN sessions with other students" },
      { icon: Star, title: "Advanced Judge Feedback", description: "Detailed analysis with improvement roadmaps" },
      { icon: FileText, title: "Exclusive Debate Topics", description: "Access to premium topic library and resources" },
      { icon: Users, title: "Group Practice Sessions", description: "Join exclusive debate groups and tournaments" }
    ],
    interview: [
      { icon: Target, title: "Role-Specific Q&A Banks", description: "Curated questions for specific roles and companies" },
      { icon: Users, title: "Recruiter Mentorship", description: "1-on-1 sessions with industry recruiters" },
      { icon: Award, title: "Interview Certification", description: "Verified certificates for skill demonstration" },
      { icon: Video, title: "Mock Panel Interviews", description: "Multi-interviewer simulation sessions" }
    ],
    pitch: [
      { icon: Target, title: "Investor-Style Due Diligence", description: "Deep-dive analysis of your business proposals" },
      { icon: Users, title: "Custom Mock Panels", description: "Tailored investor panels based on your industry" },
      { icon: FileText, title: "Deck Reframe Feedback", description: "Professional pitch deck optimization" },
      { icon: Rocket, title: "Startup Accelerator Network", description: "Connect with accelerators and VCs" }
    ]
  };

  const pricingPlans = [
    {
      name: "Individual Premium",
      price: "₹999",
      period: "per month",
      description: "Perfect for students and professionals",
      features: [
        "All premium features",
        "Unlimited practice sessions",
        "Expert feedback",
        "1-on-1 monthly mentorship",
        "Access to exclusive content"
      ],
      popular: false
    },
    {
      name: "Academic Premium",
      price: "₹1,499",
      period: "per month",
      description: "Ideal for serious learners and competitors",
      features: [
        "Everything in Individual",
        "Live group sessions",
        "Competition prep",
        "Certificate programs",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Institution",
      price: "Custom",
      period: "pricing",
      description: "For schools, colleges, and organizations",
      features: [
        "Bulk licenses",
        "Admin dashboard",
        "Progress tracking",
        "Custom curriculums",
        "Dedicated support"
      ],
      popular: false
    }
  ];

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
              Go Premium
            </h1>
            
            {/* Tagline */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
              Practice smarter • Perform better
            </h2>
            
            {/* Subtext */}
            <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
              Unlock advanced AI feedback, unlimited practice, reports, and priority access to live arenas & events.
            </h3>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                🎁 Start Free Trial
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                📊 Compare Plans
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                ⭐ Upgrade to Pro
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline text-lg px-8 py-4 min-w-[280px] rounded-2xl font-medium"
              >
                📞 Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Tabs */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-6">Premium Features by Module</h2>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore advanced capabilities designed to accelerate your growth in each area.
            </p>
          </div>

          <Tabs defaultValue="debate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="debate" className="font-ui">
                <Zap className="h-4 w-4 mr-2" />
                Premium Debate
              </TabsTrigger>
              <TabsTrigger value="interview" className="font-ui">
                <Target className="h-4 w-4 mr-2" />
                Premium Interview
              </TabsTrigger>
              <TabsTrigger value="pitch" className="font-ui">
                <Rocket className="h-4 w-4 mr-2" />
                Premium Pitch
              </TabsTrigger>
            </TabsList>

            <TabsContent value="debate" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="font-heading text-3xl font-bold mb-4">Premium Debate Features</h3>
                <p className="font-body text-lg text-muted-foreground">
                  Exclusive debate topics, live MUN simulations, advanced judge feedback
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {premiumFeatures.debate.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-ui font-semibold text-lg mb-2">{feature.title}</h4>
                          <p className="font-body text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="interview" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="font-heading text-3xl font-bold mb-4">Premium Interview Features</h3>
                <p className="font-body text-lg text-muted-foreground">
                  Role-specific Q&A banks, recruiter mentorship, certification
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {premiumFeatures.interview.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-ui font-semibold text-lg mb-2">{feature.title}</h4>
                          <p className="font-body text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="pitch" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="font-heading text-3xl font-bold mb-4">Premium Pitch Features</h3>
                <p className="font-body text-lg text-muted-foreground">
                  Investor-style due diligence, custom mock panels, deck reframe feedback
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {premiumFeatures.pitch.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-ui font-semibold text-lg mb-2">{feature.title}</h4>
                          <p className="font-body text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-6">Choose Your Premium Plan</h2>
            <p className="font-body text-xl text-muted-foreground">
              Select the plan that best fits your learning goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 relative ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1 font-ui">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="font-heading text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="font-heading text-4xl font-bold">{plan.price}</span>
                    <span className="font-body text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="font-body text-muted-foreground">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-body">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full font-ui ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.name === "Institution" ? "Contact Sales" : "Upgrade to Premium"}
                </Button>
              </Card>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3">
              <Award className="h-6 w-6 text-accent" />
              <span className="font-ui font-semibold">30-Day Money Back Guarantee</span>
            </div>
            <p className="font-body text-muted-foreground mt-4">
              Try Premium risk-free. If you're not satisfied, we'll refund your money.
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-6">Premium Success Stories</h2>
            <p className="font-body text-xl text-muted-foreground">
              See how Premium members have transformed their communication skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-ui font-semibold text-lg">National MUN Winner</h4>
                  <p className="font-body text-muted-foreground">Harvard MUN 2024</p>
                </div>
              </div>
              <p className="font-body text-muted-foreground mb-6">
                "The premium debate features, especially the live MUN simulations, prepared me for the real competition. I won Best Delegate at Harvard MUN 2024!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-ui font-semibold text-primary">S</span>
                </div>
                <div>
                  <p className="font-ui font-semibold">Shreya Krishnan</p>
                  <p className="font-body text-sm text-muted-foreground">St. Stephen's College</p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h4 className="font-ui font-semibold text-lg">FAANG Job Secured</h4>
                  <p className="font-body text-muted-foreground">Google Software Engineer</p>
                </div>
              </div>
              <p className="font-body text-muted-foreground mb-6">
                "The recruiter mentorship and role-specific Q&A banks were game-changers. Landed my dream job at Google with 40% salary increase!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-ui font-semibold text-accent">A</span>
                </div>
                <div>
                  <p className="font-ui font-semibold">Ankit Sharma</p>
                  <p className="font-body text-sm text-muted-foreground">IIT Delhi Graduate</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="font-heading text-4xl font-bold mb-6">
            Ready to Unlock Your Premium Potential?
          </h2>
          <p className="font-body text-xl text-white/90 mb-8">
            Join thousands of successful students and professionals who've transformed their careers with Premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 font-ui px-8 py-4">
              Start Premium Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-ui px-8 py-4">
              Compare All Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Premium;