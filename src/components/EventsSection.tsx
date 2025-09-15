import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react";

const events = [
  {
    id: 1,
    title: "AI Debate Championship 2024",
    date: "Dec 15, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Virtual Arena",
    participants: 156,
    category: "Debate",
    status: "Open",
    prize: "$5,000",
    description: "Global AI-powered debate competition with real-time scoring"
  },
  {
    id: 2,
    title: "Tech Interview Bootcamp",
    date: "Dec 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Online",
    participants: 89,
    category: "Interview",
    status: "Filling Fast",
    prize: "Job Opportunities",
    description: "Intensive mock interview sessions with top tech companies"
  },
  {
    id: 3,
    title: "Startup Pitch Fest",
    date: "Jan 5, 2025",
    time: "9:00 AM - 8:00 PM",
    location: "Hybrid Event",
    participants: 42,
    category: "Pitch",
    status: "Premium",
    prize: "$10,000 Funding",
    description: "Present your startup to real investors and AI judges"
  },
  {
    id: 4,
    title: "Model UN Climate Summit",
    date: "Jan 12, 2025",
    time: "All Day",
    location: "Virtual UN Hall",
    participants: 203,
    category: "MUN",
    status: "Open",
    prize: "Certificates",
    description: "Simulate global climate negotiations with AI-powered dynamics"
  }
];

const EventsSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">
            Community <span className="gradient-text">Events</span>
          </h2>
          <p className="text-xl font-body text-muted-foreground max-w-2xl mx-auto mb-2">
            Join our vibrant community every Saturday & Sunday
          </p>
          <p className="text-lg font-body text-muted-foreground">
            Practice with fellow speakers and build lasting connections
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {events.map((event) => (
            <Card key={event.id} className="card-modern group border-2 border-transparent hover:border-primary/20 hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge 
                    variant={event.status === 'Open' ? 'default' : 'secondary'} 
                    className="font-ui bg-primary text-primary-foreground"
                  >
                    {event.status}
                  </Badge>
                  <Badge variant="outline" className="font-ui border-accent-blue text-accent-blue">
                    {event.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-heading text-foreground group-hover:text-primary transition-colors mb-3">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-base font-body text-muted-foreground leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground font-body">
                  <Calendar className="w-4 h-4 mr-3 text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground font-body">
                  <Clock className="w-4 h-4 mr-3 text-primary" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground font-body">
                  <MapPin className="w-4 h-4 mr-3 text-primary" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground font-body">
                  <Users className="w-4 h-4 mr-3 text-primary" />
                  {event.participants} participants
                </div>
                <div className="flex items-center text-sm font-medium text-accent-green font-body">
                  <Trophy className="w-4 h-4 mr-3" />
                  {event.prize}
                </div>
              </CardContent>
              
              <div className="p-6 pt-0">
                <Button 
                  className={`w-full font-ui ${event.status === 'Open' ? 'button-emerald' : 'opacity-50'} py-3`}
                  disabled={event.status !== 'Open'}
                >
                  {event.status === 'Open' ? 'Register Now' : 'Upgrade to Join'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button className="button-secondary text-lg px-8 py-4">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;