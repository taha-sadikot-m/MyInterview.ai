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
    <section className="py-24 px-4 bg-gradient-to-b from-background to-neutral-soft">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-heading text-6xl md:text-8xl mb-8 gradient-text-secondary">
            Upcoming Events
          </h2>
          <p className="font-body text-2xl text-foreground/80 max-w-5xl mx-auto">
            Join thousands of Gen-Z speakers in our epic events and competitions! 🎉
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {events.map((event, index) => (
            <div key={index} className="card-genz group overflow-hidden">
              {/* Event Image */}
              <div className="relative h-56 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl mb-8 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-bounce">
                    {event.type === "Competition" && "🏆"}
                    {event.type === "Workshop" && "🌍"}
                    {event.type === "Pitch" && "🚀"}
                    {event.type === "Training" && "💼"}
                  </div>
                </div>
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-accent to-accent-pink text-white px-4 py-2 rounded-full text-sm font-ui font-semibold">
                    {event.badge}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <span className="bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-ui font-semibold">
                    {event.type}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-3xl mb-4 gradient-text group-hover:scale-105 transition-transform duration-300">
                    {event.title}
                  </h3>
                  <p className="font-body text-foreground/70 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Event Meta */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-ui text-sm font-bold text-foreground">{event.date}</p>
                      <p className="font-ui text-xs text-foreground/60">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl">
                    <MapPin className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-ui text-sm font-bold text-foreground truncate">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl">
                    <Users className="w-6 h-6 text-secondary-emerald" />
                    <p className="font-ui text-sm font-bold text-foreground">{event.participants}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl">
                    <Clock className="w-6 h-6 text-accent" />
                    <p className="font-ui text-sm font-bold text-foreground">Registration Open</p>
                  </div>
                </div>

                {/* Register Button */}
                <Button className="btn-secondary w-full text-xl py-6 rounded-3xl font-ui group-hover:scale-110 transition-all duration-500">
                  Register Now ✨
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Events */}
        <div className="text-center mt-20">
          <Button className="btn-primary text-2xl px-16 py-8 rounded-3xl font-ui">
            View All Events 🎊
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;