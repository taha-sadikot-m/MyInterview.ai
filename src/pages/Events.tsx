import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Target } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "School Debate Championship",
      category: "School Debate/MUN",
      date: "Saturday, Sep 16",
      time: "10:00 AM - 4:00 PM",
      location: "Mumbai",
      participants: 45,
      description: "Age-appropriate debate topics and MUN simulations for school students."
    },
    {
      id: 2,
      title: "College Parliamentary Debate",
      category: "College Debate/MUN",
      date: "Saturday, Sep 16",
      time: "2:00 PM - 8:00 PM",
      location: "Delhi",
      participants: 68,
      description: "Advanced debate formats with complex motions and diplomatic negotiations."
    },
    {
      id: 3,
      title: "Fresher Interview Clinic",
      category: "Fresher Interview Clinics",
      date: "Sunday, Sep 17",
      time: "11:00 AM - 3:00 PM",
      location: "Bangalore",
      participants: 32,
      description: "Mock interviews with industry professionals for fresh graduates."
    },
    {
      id: 4,
      title: "Bootstrapped Founder Pitch Night",
      category: "Bootstrapped Founder Pitch Nights",
      date: "Sunday, Sep 17",
      time: "6:00 PM - 9:00 PM",
      location: "Hyderabad",
      participants: 24,
      description: "Present your startup pitch to angel investors and get real feedback."
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "School Debate/MUN":
        return "bg-blue-100 text-blue-800";
      case "College Debate/MUN":
        return "bg-green-100 text-green-800";
      case "Fresher Interview Clinics":
        return "bg-purple-100 text-purple-800";
      case "Bootstrapped Founder Pitch Nights":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
                Events & Competitions
              </h1>
              
              {/* Tagline */}
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 tracking-wider">
                Join • Compete • Showcase your voice
              </h2>
              
              {/* Subtext */}
              <h3 className="font-fancy text-xl md:text-2xl lg:text-3xl italic text-foreground mb-8">
                Register for debates, MUNs, pitch competitions, and hackathons. The stage is yours!
              </h3>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="btn-primary text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
                >
                  📝 Register Now
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
                >
                  👀 View Details
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
                >
                  📆 Add to Calendar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
                >
                  🎓 Apply as Judge/Mentor
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-outline text-lg px-8 py-4 min-w-[250px] rounded-2xl font-medium"
                >
                  🏆 View Past Winners
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="card-shadow card-hover bg-card border rounded-2xl">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getCategoryColor(event.category)} font-ui`}>
                    {event.category}
                  </Badge>
                  <div className="flex items-center text-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm font-ui">{event.participants} joined</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-heading text-foreground">{event.title}</CardTitle>
                <CardDescription className="font-body text-foreground">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-foreground">
                    <Calendar className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-ui text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    <Clock className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-ui text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    <MapPin className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-ui text-sm">{event.location}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-ui">
                  Register for Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Event Categories Info */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-card border rounded-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-heading text-foreground">School Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-body text-foreground text-center">
                Age-appropriate debate topics and basic MUN training
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border rounded-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-sm font-heading text-foreground">College Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-body text-foreground text-center">
                Advanced parliamentary debate and complex MUN committees
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border rounded-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-sm font-heading text-foreground">Interview Clinics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-body text-foreground text-center">
                Mock interviews with real recruiters for fresh graduates
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border rounded-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle className="text-sm font-heading text-foreground">Pitch Nights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-body text-foreground text-center">
                Present to angel investors and get funding feedback
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Events;