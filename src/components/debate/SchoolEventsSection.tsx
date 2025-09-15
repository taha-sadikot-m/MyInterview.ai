import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Upload, Radio, BookOpen } from "lucide-react";

export const SchoolEventsSection = () => {
  const events = [
    {
      title: "News Reading in Assembly",
      description: "Practice morning assembly news reading with proper intonation and clarity",
      icon: Radio,
      color: "from-blue-500 to-blue-600",
      features: ["Upload audio", "AI pronunciation feedback", "Clarity scoring", "Pace analysis"],
    },
    {
      title: "English Elocution",
      description: "Master poem and passage recitation with emotional expression",
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
      features: ["Pick passage/poem", "Record recitation", "Expression analysis", "Delivery tips"],
    },
    {
      title: "Extempore",
      description: "Spontaneous speaking on random school and GenZ topics",
      icon: Mic,
      color: "from-purple-500 to-purple-600",
      features: ["Random topic generator", "Live recording", "Structure feedback", "Confidence building"],
    },
    {
      title: "Storytelling",
      description: "Craft and deliver engaging stories with proper narrative flow",
      icon: Upload,
      color: "from-rose-500 to-rose-600",
      features: ["Upload/record stories", "Narrative evaluation", "Engagement scoring", "Plot analysis"],
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-6xl mb-6 text-foreground">
            Prepare for Your School Events
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Excel in school competitions with AI-powered practice sessions and detailed performance feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <Card key={index} className="card-modern group border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-start gap-6 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <event.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl mb-3 text-foreground">
                    {event.title}
                  </h3>
                  <p className="font-body text-muted-foreground mb-4">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {event.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-ui text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Upload/Record Zone */}
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center mb-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-ui text-sm text-muted-foreground">
                    Drag & drop audio file or click to record
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary/30 hover:border-primary"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Record
                </Button>
                <Button 
                  className="flex-1 button-primary"
                >
                  Start Practice
                </Button>
              </div>

              {/* Feedback Panel Preview */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-ui font-semibold text-sm text-foreground">AI Feedback Panel</span>
                  <span className="font-ui text-xs text-muted-foreground">After submission</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-xs text-muted-foreground">Overall Score</span>
                    <div className="w-16 h-2 bg-border rounded-full">
                      <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-xs text-muted-foreground">Delivery</span>
                    <div className="w-16 h-2 bg-border rounded-full">
                      <div className="w-4/5 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};