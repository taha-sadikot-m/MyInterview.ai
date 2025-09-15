import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";

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
    <section id="events" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 gradient-text">
            Upcoming Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join competitions, workshops, and challenges to showcase your speaking skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {events.map((event, index) => (
            <Card
              key={event.id}
              className="group hover:scale-[1.02] transition-all duration-300 card-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant={event.status === "Open" ? "default" : event.status === "Premium" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-heading font-bold mb-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription>
                      {event.description}
                    </CardDescription>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Trophy className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.date}</div>
                      <div className="text-muted-foreground">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.participants} Participants</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.prize}</div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant={event.status === "Premium" ? "hero" : "world"} 
                  className="w-full"
                  size="lg"
                >
                  {event.status === "Premium" ? "Upgrade to Join" : "Register Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;