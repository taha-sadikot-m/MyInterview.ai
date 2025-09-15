import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Brain, Target, MessageSquare } from "lucide-react";

export const DebatePracticeSection = () => {
  const topics = [
    "Should AI replace teachers in schools?",
    "Is social media beneficial for teenagers?",
    "Should school uniforms be mandatory?",
    "Is online learning better than classroom learning?",
    "Should students have unlimited internet access?",
    "Is homework necessary for learning?",
    "Should schools ban smartphones?",
    "Is climate change education mandatory?",
  ];

  const steps = [
    {
      number: "1",
      title: "Pick a Topic",
      description: "Choose from syllabus topics or trending GenZ debates",
      icon: Target,
    },
    {
      number: "2",
      title: "AI Asks Question",
      description: "Press mic button → AI Chanakya asks by voice",
      icon: Brain,
    },
    {
      number: "3",
      title: "Answer by Voice",
      description: "Student responds using voice recording",
      icon: Mic,
    },
    {
      number: "4",
      title: "Get AI Feedback",
      description: "Scores on Clarity, Logic, Delivery, Confidence",
      icon: MessageSquare,
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-6xl mb-6 text-foreground">
            Practice Your Debate Skills
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Train with AI Chanakya, the ancient strategist, to master the art of persuasive debate and logical argumentation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Instructions Card */}
          <Card className="card-modern mb-12 border-primary/20">
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-ui font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-ui font-semibold text-lg mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Practice Interface */}
          <Card className="card-modern border-primary/20">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl mb-4 text-foreground">
                Ready to Debate?
              </h3>
              
              <div className="max-w-md mx-auto mb-8">
                <Select>
                  <SelectTrigger className="h-12 font-ui">
                    <SelectValue placeholder="Choose your debate topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic, index) => (
                      <SelectItem key={index} value={topic} className="font-body">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                size="lg" 
                className="button-primary min-w-[280px] h-16 font-ui font-semibold text-lg"
              >
                <Brain className="w-6 h-6 mr-3" />
                Start Debate with Chanakya
              </Button>
            </div>

            {/* Judge Feedback Preview */}
            <div className="mt-12 p-6 bg-muted/50 rounded-xl">
              <h4 className="font-ui font-semibold text-lg mb-4 text-center text-foreground">
                AI Judge Feedback Panel
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Clarity', 'Logic', 'Delivery', 'Confidence'].map((skill) => (
                  <div key={skill} className="text-center">
                    <div className="w-full bg-border rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full w-4/5"></div>
                    </div>
                    <span className="font-ui text-sm text-muted-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};