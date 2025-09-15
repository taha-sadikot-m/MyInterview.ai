import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileAudio, Star, TrendingUp, Clock } from "lucide-react";

export const GSLSpeechSection = () => {
  const judgeScores = [
    { category: "Content", score: 4.2, maxScore: 5 },
    { category: "Structure", score: 3.8, maxScore: 5 },
    { category: "Delivery", score: 4.5, maxScore: 5 },
    { category: "Time Discipline", score: 3.5, maxScore: 5 },
  ];

  const strengths = [
    "Clear position statement and strong opening",
    "Effective use of evidence and statistics",
    "Confident delivery with good voice modulation",
  ];

  const improvements = [
    "Add more counter-argument addressing",
    "Improve time management for conclusion",
    "Include more country-specific perspectives",
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="section-content">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-6xl mb-6 text-foreground">
            Upload Your GSL Speech
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Get professional MUN judge feedback on your General Speakers List speech with detailed scoring and improvement suggestions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Upload Interface */}
          <Card className="card-modern border-primary/20">
            <div className="text-center">
              <h3 className="font-heading text-2xl mb-6 text-foreground">
                Submit Your Speech
              </h3>

              {/* Drag & Drop Zone */}
              <div className="border-2 border-dashed border-primary/40 rounded-xl p-12 mb-8 hover:border-primary/60 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileAudio className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-ui font-semibold text-lg mb-2 text-foreground">
                      Drop your audio file here
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      Supports MP3, WAV, M4A up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full h-14 border-primary/30 hover:border-primary"
                >
                  <Upload className="w-5 h-5 mr-3" />
                  Choose Audio File
                </Button>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="font-ui text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-14 button-primary"
                >
                  <Mic className="w-5 h-5 mr-3" />
                  Record Speech Now
                </Button>
              </div>

              {/* Recording Tips */}
              <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                <h4 className="font-ui font-semibold mb-3 text-foreground">Recording Tips</h4>
                <ul className="font-body text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Speak clearly and maintain good pace</li>
                  <li>• Keep within 1-2 minute time limit</li>
                  <li>• Include position, evidence, and conclusion</li>
                  <li>• Record in a quiet environment</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Judge's Panel Preview */}
          <Card className="card-modern border-primary/20">
            <div className="text-center mb-6">
              <h3 className="font-heading text-2xl mb-2 text-foreground">
                Judge's Panel Feedback
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Sample feedback after speech submission
              </p>
            </div>

            {/* Scores Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {judgeScores.map((item, index) => (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="font-ui font-semibold text-lg text-foreground">
                      {item.score}
                    </span>
                    <span className="font-ui text-sm text-muted-foreground">
                      /{item.maxScore}
                    </span>
                  </div>
                  <p className="font-ui text-sm text-muted-foreground">
                    {item.category}
                  </p>
                  <div className="w-full bg-border rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h4 className="font-ui font-semibold text-foreground">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-body text-sm text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <h4 className="font-ui font-semibold text-foreground">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-body text-sm text-muted-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reframe Suggestion */}
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-ui font-semibold mb-2 text-foreground">
                Sample Reframe Suggestion
              </h4>
              <p className="font-body text-sm text-muted-foreground italic">
                "Consider starting with: 'Honorable Chair, fellow delegates, as representatives of [Country], we strongly believe that...'"
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};