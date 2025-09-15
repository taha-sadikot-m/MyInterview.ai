import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, TrendingUp, Award, Calendar, Target, Briefcase, MessageSquare, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for demonstration
  const userProfile = {
    name: "Student Name",
    tagline: "Ivy League ready: 65%"
  };

  const progressData = {
    debate: {
      completedRounds: 3,
      totalRounds: 5,
      recentScore: 8.2,
      badges: ["MUN Starter", "Chanakya Challenger"]
    },
    interview: {
      attempts: 4,
      averageScore: 7.5,
      topCompetencies: ["Communication", "Problem Solving"],
      improvement: "+15%"
    },
    pitch: {
      decksAnalyzed: 2,
      lastRecommendation: "Due Diligence",
      scoreTrend: "+0.8"
    }
  };

  const recentAttempts = [
    { id: 1, module: "Interview", company: "TCS", date: "Sep 14", score: 8, status: "Hire" },
    { id: 2, module: "Debate", topic: "Climate Change", date: "Sep 12", score: 7.5, status: "Good" },
    { id: 3, module: "Pitch", startup: "EdTech Startup", date: "Sep 10", score: 7, status: "Pass" },
    { id: 4, module: "Interview", company: "Infosys", date: "Sep 8", score: 6.5, status: "Leaning No" }
  ];

  const upcomingEvents = [
    { title: "College Debate", date: "Sep 16", type: "Registered" },
    { title: "Interview Clinic", date: "Sep 17", type: "Interested" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Dashboard
          </h1>
          <p className="text-lg font-body text-foreground mb-6">
            Track your progress and choose your next challenge
          </p>
        </div>

        {/* Profile Strip */}
        <Card className="mb-8 bg-card border rounded-2xl">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">{userProfile.name}</h2>
                  <p className="text-foreground font-body">{userProfile.tagline}</p>
                </div>
              </div>
              <Button variant="outline" className="font-ui text-foreground border-secondary hover:bg-secondary/10 rounded-xl">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* MyDebate Progress */}
          <Card className="card-shadow bg-card border rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-heading text-foreground">MyDebate Progress</CardTitle>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-ui text-foreground">Practice Rounds</span>
                    <span className="text-sm font-ui text-foreground">
                      {progressData.debate.completedRounds}/{progressData.debate.totalRounds}
                    </span>
                  </div>
                  <Progress value={(progressData.debate.completedRounds / progressData.debate.totalRounds) * 100} className="h-2" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-foreground">{progressData.debate.recentScore}</p>
                  <p className="text-sm font-body text-foreground">Recent Score</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {progressData.debate.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-foreground border-primary">
                      <Award className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Progress */}
          <Card className="card-shadow bg-card border rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-heading text-foreground">Interview Progress</CardTitle>
                </div>
                <Badge className="bg-secondary text-secondary-foreground">
                  {progressData.interview.improvement}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-foreground">{progressData.interview.averageScore}</p>
                  <p className="text-sm font-body text-foreground">Average Score</p>
                </div>
                <div>
                  <p className="text-sm font-ui text-foreground mb-2">Top Competencies</p>
                  <div className="flex flex-wrap gap-2">
                    {progressData.interview.topCompetencies.map((comp) => (
                      <Badge key={comp} variant="outline" className="text-foreground border-secondary">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-body text-foreground">{progressData.interview.attempts} attempts completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pitch Progress */}
          <Card className="card-shadow bg-card border rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-heading text-foreground">Pitch Progress</CardTitle>
                </div>
                <Badge variant="outline" className="text-foreground border-secondary">
                  {progressData.pitch.scoreTrend}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-foreground">{progressData.pitch.lastRecommendation}</p>
                  <p className="text-sm font-body text-foreground">Last Result</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-body text-foreground">{progressData.pitch.decksAnalyzed} decks analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Choose Category */}
        <Card className="mb-8 bg-card border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-foreground flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Choose Category (Quick Launch)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link to="/debate">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 text-foreground border-secondary hover:bg-secondary/10 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-ui text-sm">School Debate</span>
                </Button>
              </Link>
              <Link to="/debate">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 text-foreground border-secondary hover:bg-secondary/10 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-ui text-sm">College Debate</span>
                </Button>
              </Link>
              <Link to="/interview">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 text-foreground border-secondary hover:bg-secondary/10 rounded-xl">
                  <Briefcase className="w-6 h-6" />
                  <span className="font-ui text-sm">Interview (Fresher)</span>
                </Button>
              </Link>
              <Link to="/pitch">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 text-foreground border-secondary hover:bg-secondary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                  <span className="font-ui text-sm">Pitch (Bootstrapped)</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Attempts */}
          <Card className="card-shadow bg-card border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-heading text-foreground flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Recent Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-ui font-semibold text-foreground text-sm">
                        {attempt.module} - {attempt.company || attempt.topic || attempt.startup}
                      </p>
                      <p className="font-body text-foreground text-xs">{attempt.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-ui font-bold text-foreground text-sm">{attempt.score}/10</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          attempt.status === 'Hire' || attempt.status === 'Good' 
                            ? 'border-primary text-primary' 
                            : 'border-secondary text-secondary'
                        }`}
                      >
                        {attempt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events Participated */}
          <Card className="card-shadow bg-card border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-heading text-foreground flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Events Participated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-ui font-semibold text-foreground text-sm">{event.title}</p>
                      <p className="font-body text-foreground text-xs">{event.date}</p>
                    </div>
                    <Badge 
                      className={`${
                        event.type === 'Registered' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link to="/events">
                <Button variant="outline" className="w-full mt-4 text-foreground border-secondary hover:bg-secondary/10 rounded-xl font-ui">
                  View All Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;