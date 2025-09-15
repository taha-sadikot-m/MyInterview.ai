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
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Community Events
          </h1>
          <p className="text-lg font-body text-foreground mb-6">
            Join weekend sessions to practice, network, and improve your skills
          </p>
        </div>

        {/* Instructions Panel */}
        <Card className="mb-8 bg-card border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-foreground flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Upcoming Events This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-foreground">
              Choose from debate sessions, MUN simulations, interview clinics, and pitch nights. 
              All events are designed for peer learning and skill development in a supportive community environment.
            </p>
          </CardContent>
        </Card>

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