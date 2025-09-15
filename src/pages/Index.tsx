import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, Briefcase, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
            MyDebate.ai
          </h1>
          <p className="text-xl md:text-2xl font-body text-foreground mb-4">
            Be Ivy League ready — with MyDebate.
          </p>
          <p className="text-lg md:text-xl font-body text-foreground mb-12">
            Prepare. Practice. Perform.
          </p>
        </div>
      </section>

      {/* Start Your Journey Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-12">
            Start Your Journey - 4 Options
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* MyDebate World */}
            <Card className="card-shadow card-hover bg-card border rounded-2xl">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-heading text-foreground">MyDebate World</CardTitle>
                <CardDescription className="font-body text-foreground">
                  Be Ivy League ready for MyDebate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground mb-6">
                  Master debate skills and MUN with AI coaching, practice rounds, and community events.
                </p>
                <Link to="/debate">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-ui">
                    Start Debate
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* MyInterview World */}
            <Card className="card-shadow card-hover bg-card border rounded-2xl">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl font-heading text-foreground">MyInterview World</CardTitle>
                <CardDescription className="font-body text-foreground">
                  Land any job (Fresher).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground mb-6">
                  Practice interviews with AI recruiters and get actionable feedback to land your dream job.
                </p>
                <Link to="/interview">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-ui">
                    Practice Interview
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* MyPitch World */}
            <Card className="card-shadow card-hover bg-card border rounded-2xl">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-heading text-foreground">MyPitch World</CardTitle>
                <CardDescription className="font-body text-foreground">
                  Get your first cheque (Bootstrapped).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground mb-6">
                  Perfect your startup pitch with AI investors and secure funding with confidence.
                </p>
                <Link to="/pitch">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-ui">
                    Pitch Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Events */}
            <Card className="card-shadow bg-card border rounded-2xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl font-heading text-foreground">Events</CardTitle>
                    <CardDescription className="font-body text-foreground">This week's sessions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground mb-4">
                  Join community debates, MUN sessions, interview clinics, and pitch nights.
                </p>
                <Link to="/events">
                  <Button variant="outline" className="w-full border-secondary text-foreground hover:bg-secondary/10 rounded-xl font-ui">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Dashboard */}
            <Card className="card-shadow bg-card border rounded-2xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl font-heading text-foreground">Dashboard</CardTitle>
                    <CardDescription className="font-body text-foreground">View progress</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-foreground mb-4">
                  Track your improvement across debates, interviews, and pitches.
                </p>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full border-secondary text-foreground hover:bg-secondary/10 rounded-xl font-ui">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;