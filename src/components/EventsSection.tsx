import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const EventsSection = () => {
  const events = [
    {
      title: "National Debate Championship",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM", 
      location: "Delhi University",
      participants: "500+ Students",
      type: "Competition",
      badge: "🏆 Championship",
      description: "Compete with India's brightest minds in this prestigious debate tournament."
    },
    {
      title: "MUN Simulation Workshop", 
      date: "March 22, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Online + Mumbai Hub",
      participants: "200+ Delegates", 
      type: "Workshop",
      badge: "🌍 MUN",
      description: "Intensive Model UN training with real diplomats and experienced chairs."
    },
    {
      title: "Startup Pitch Battle",
      date: "April 5, 2024", 
      time: "11:00 AM - 5:00 PM",
      location: "Bangalore Tech Park",
      participants: "100+ Entrepreneurs",
      type: "Pitch",
      badge: "🚀 Startup",
      description: "Present your startup idea to real investors and win funding opportunities."
    },
    {
      title: "Interview Skills Bootcamp",
      date: "April 12, 2024",
      time: "9:00 AM - 3:00 PM", 
      location: "Gurgaon Business District",
      participants: "150+ Job Seekers",
      type: "Training",
      badge: "💼 Career",
      description: "Master interview techniques with HR experts from top companies."
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="section-content">
        <div className="text-center mb-20">
          <h2 className="font-heading text-5xl md:text-7xl mb-6 gradient-text">
            Upcoming Events
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-4xl mx-auto">
            Join thousands of students and professionals in our exciting speaking events and competitions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <Card key={index} className="card-modern group overflow-hidden hover:shadow-2xl">
              {/* Event Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-xl mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-50">
                    {event.type === "Competition" && "🏆"}
                    {event.type === "Workshop" && "🌍"}
                    {event.type === "Pitch" && "🚀"}
                    {event.type === "Training" && "💼"}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-ui font-semibold">
                    {event.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-ui">
                    {event.type}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl mb-3 group-hover:gradient-text-purple transition-all duration-300">
                    {event.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {event.description}
                  </p>
                </div>

                {/* Event Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-ui text-sm font-semibold">{event.date}</p>
                      <p className="font-body text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-ui text-sm font-semibold truncate">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-500" />
                    <p className="font-ui text-sm">{event.participants}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <p className="font-ui text-sm">Registration Open</p>
                  </div>
                </div>

                {/* Register Button */}
                <Button className="btn-emerald w-full text-lg py-4 rounded-2xl font-ui group-hover:scale-105 transition-transform duration-300">
                  Register Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Events */}
        <div className="text-center mt-16">
          <Button className="btn-secondary text-lg px-8 py-4 rounded-2xl border-primary">
            View All Events →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;