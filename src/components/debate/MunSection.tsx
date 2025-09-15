import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, Users, FileText } from "lucide-react";

export const MunSection = () => {
  const videos = [
    {
      title: "MUN Basics",
      description: "Understanding Model United Nations fundamentals",
      duration: "8:30",
      icon: Users,
    },
    {
      title: "Rules & Procedures",
      description: "Parliamentary procedure and debate formats",
      duration: "12:45",
      icon: FileText,
    },
    {
      title: "How to Research a Country",
      description: "Effective research strategies for your delegation",
      duration: "15:20",
      icon: Play,
    },
  ];

  const faqs = [
    {
      question: "What is a GSL?",
      answer: "General Speakers List (GSL) is the formal debate format where delegates address the committee in order of registration.",
    },
    {
      question: "How to draft a speech?",
      answer: "Start with a strong position statement, provide evidence, address counterarguments, and conclude with actionable solutions.",
    },
    {
      question: "What are moderated caucuses?",
      answer: "Moderated caucuses are structured discussions led by the chair with specific speaking time limits and topics.",
    },
    {
      question: "How to write a resolution?",
      answer: "Resolutions should include preambulatory clauses (background) and operative clauses (solutions) following UN format.",
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-6xl mb-6 gradient-text">
            What is MUN?
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Master the art of diplomacy, debate, and international relations through our comprehensive MUN training program.
          </p>
        </div>

        {/* Video Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {videos.map((video, index) => (
            <Card key={index} className="card-modern group cursor-pointer">
              <div className="relative mb-6">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-ui">
                  {video.duration}
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <video.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl mb-2 text-foreground">
                    {video.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {video.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-heading text-3xl mb-8 text-center text-foreground">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card"
              >
                <AccordionTrigger className="font-ui text-lg font-semibold text-left hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};