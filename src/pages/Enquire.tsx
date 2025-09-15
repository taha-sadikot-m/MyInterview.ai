import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Heart, 
  BookOpen, 
  Users,
  Mail,
  User,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Enquire = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const enquiryTypes = [
    {
      id: "student",
      title: "Student",
      description: "I'm a student looking to improve my communication skills",
      icon: GraduationCap,
      color: "primary"
    },
    {
      id: "parent",
      title: "Parent",
      description: "I want to help my child develop better speaking abilities",
      icon: Heart,
      color: "accent"
    },
    {
      id: "educator",
      title: "Educator",
      description: "I'm a teacher/educator interested in this for my students",
      icon: BookOpen,
      color: "secondary"
    },
    {
      id: "trainer",
      title: "Trainer",
      description: "I'm a trainer looking to partner or collaborate",
      icon: Users,
      color: "primary"
    }
  ];

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && enquiryTypes.some(type => type.id === typeFromUrl)) {
      setSelectedType(typeFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      toast({
        title: "Please select an enquiry type",
        description: "Choose the option that best describes you.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to submit your enquiry.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    console.log("Enquiry submitted:", { type: selectedType, ...formData });
    
    setIsSubmitted(true);
    toast({
      title: "Enquiry submitted successfully!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <section className="section-padding">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-accent/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-accent" />
            </div>
            <h1 className="font-heading text-4xl font-bold mb-6">Thank You!</h1>
            <p className="font-body text-xl text-muted-foreground mb-8">
              Your enquiry has been submitted successfully. Our team will review your message and get back to you within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-ui font-semibold mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className="font-body">We'll review your enquiry within 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="font-body">A team member will contact you via email</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span className="font-body">We'll schedule a consultation call if needed</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setSelectedType("");
                setFormData({ name: "", email: "", message: "" });
              }}
              className="font-ui"
            >
              Submit Another Enquiry
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-modern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-alt"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Enquire With Us
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Tell us about yourself and how we can help you achieve your communication goals.
          </p>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 1: Choose Type */}
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-center mb-8">Choose Your Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enquiryTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <Card 
                    key={type.id}
                    className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-ui font-semibold text-lg mb-2">{type.title}</h3>
                        <p className="font-body text-muted-foreground">{type.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Step 2: Form */}
          {selectedType && (
            <Card className="p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                Tell Us More About Yourself
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-ui">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="font-body"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-ui">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="font-body"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="font-ui">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your goals, requirements, or any questions you have..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="font-body min-h-32"
                    required
                  />
                </div>

                <div className="text-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 font-ui px-8 py-3"
                  >
                    Submit Enquiry
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Contact Info */}
          <div className="mt-16 text-center">
            <h3 className="font-heading text-2xl font-bold mb-6">Other Ways to Reach Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-ui font-semibold mb-2">Email</h4>
                <p className="font-body text-muted-foreground">hello@speakyourmind.com</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-ui font-semibold mb-2">WhatsApp</h4>
                <p className="font-body text-muted-foreground">+91 98765 43210</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="font-ui font-semibold mb-2">Support</h4>
                <p className="font-body text-muted-foreground">support@speakyourmind.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enquire;