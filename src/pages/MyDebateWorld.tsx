import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Calendar, Target, CheckCircle } from "lucide-react";

const MyDebateWorld = () => {
  const [selectedCategory, setSelectedCategory] = useState<"school" | "college">("school");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            MyDebate World
          </h1>
          <p className="text-lg font-body text-foreground mb-6">
            Be Ivy League ready for MyDebate.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted rounded-xl p-1 flex">
            <Button
              variant={selectedCategory === "school" ? "default" : "ghost"}
              className={`rounded-lg font-ui ${selectedCategory === "school" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
              onClick={() => setSelectedCategory("school")}
            >
              School Students
            </Button>
            <Button
              variant={selectedCategory === "college" ? "default" : "ghost"}
              className={`rounded-lg font-ui ${selectedCategory === "college" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
              onClick={() => setSelectedCategory("college")}
            >
              College Students
            </Button>
          </div>
        </div>

        {/* Instructions Panel */}
        <Card className="mb-8 bg-card border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-foreground flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              What you can do on this page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 font-body text-foreground">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Choose <strong>{selectedCategory === "school" ? "School" : "College"}</strong> mode for age-appropriate content.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Enter <strong>MUN Arena</strong> for rules, roles, and country assignment.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Try <strong>Debate with Chanakya</strong> (AI opponent & coach).
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Complete <strong>5 practice rounds</strong> to unlock a progress badge.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                View <strong>events</strong> and register for Saturday/Sunday sessions.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mt-1 mr-2 text-primary flex-shrink-0" />
                Save attempts to <strong>Dashboard</strong> for progress tracking.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* MUN Arena */}
          <Card className="card-shadow card-hover bg-card border rounded-2xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl font-heading text-foreground">MUN Arena</CardTitle>
              <CardDescription className="font-body text-foreground">
                {selectedCategory === "school" 
                  ? "Model UN basics for school students" 
                  : "Advanced MUN with complex committees"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <Badge variant="outline" className="text-foreground border-secondary">Country Assignment</Badge>
                <Badge variant="outline" className="text-foreground border-secondary">Committee Selection</Badge>
                <Badge variant="outline" className="text-foreground border-secondary">3 Guided Motions</Badge>
              </div>
              <p className="font-body text-foreground text-sm mb-6">
                {selectedCategory === "school" 
                  ? "Learn UN rules, represent countries, and debate global issues with 3-minute speeches."
                  : "Navigate complex diplomatic negotiations with Points of Information and 5-7 minute speeches."}
              </p>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-ui">
                Enter MUN Arena
              </Button>
            </CardContent>
          </Card>

          {/* Debate with Chanakya */}
          <Card className="card-shadow card-hover bg-card border rounded-2xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-heading text-foreground">Debate with Chanakya</CardTitle>
              <CardDescription className="font-body text-foreground">
                AI opponent & coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <Badge variant="outline" className="text-foreground border-primary">Topic Picker</Badge>
                <Badge variant="outline" className="text-foreground border-primary">Cross-Examination</Badge>
                <Badge variant="outline" className="text-foreground border-primary">Instant Tips</Badge>
              </div>
              <p className="font-body text-foreground text-sm mb-6">
                {selectedCategory === "school" 
                  ? "Practice with age-appropriate topics and receive gentle feedback on your arguments."
                  : "Face challenging cross-examination and complex motions with advanced coaching."}
              </p>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-ui">
                Start Debate
              </Button>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="card-shadow card-hover bg-card border rounded-2xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-heading text-foreground">Community Events</CardTitle>
              <CardDescription className="font-body text-foreground">
                Weekend debate sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-ui font-semibold text-foreground text-sm">Saturday Debate</p>
                    <p className="font-body text-foreground text-xs">
                      {selectedCategory === "school" ? "School MUN Practice" : "College Parliamentary"}
                    </p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">This Week</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-ui font-semibold text-foreground text-sm">Sunday Workshop</p>
                    <p className="font-body text-foreground text-xs">Advanced Techniques</p>
                  </div>
                  <Badge variant="outline" className="text-foreground border-secondary">Upcoming</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full border-secondary text-foreground hover:bg-secondary/10 rounded-xl font-ui">
                Register for Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyDebateWorld;