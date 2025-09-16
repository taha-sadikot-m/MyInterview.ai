import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, TrendingUp, Target, Award } from "lucide-react";

interface JudgePanelProps {
  type: 'debate' | 'interview';
  data: DebateJudgeData | InterviewJudgeData;
}

interface DebateJudgeData {
  scores: {
    Clarity: number;
    Evidence: number;
    Rebuttal: number;
    Delivery: number;
    TimeDiscipline: number;
  };
  strengths: string[];
  improvements: string[];
  evidence: string[];
  gslReframe?: {
    before: string;
    after: string;
  };
  badgeUnlocks: string[];
}

interface InterviewJudgeData {
  overall: string;
  competencies: {
    Communication: number;
    StructuredThinkingSTAR: number;
    TechnicalFundamentals: number;
    ProblemSolving: number;
    CultureOwnership: number;
    Coachability: number;
  };
  evidence: string[];
  strengths: string[];
  improvements: string[];
  followUps: string[];
  starReframe?: {
    before: string;
    after: string;
  };
  actionPlan: Array<{
    day: number;
    task: string;
  }>;
  score: number;
}

export const JudgePanel = ({ type, data }: JudgePanelProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getOverallColor = (overall: string) => {
    switch (overall) {
      case "Strong Hire":
      case "Hire":
        return "bg-green-100 text-green-800 border-green-300";
      case "Leaning No":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "No Hire":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (type === 'debate') {
    const debateData = data as DebateJudgeData;
    
    return (
      <div className="card-judge-panel space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-primary mr-3" />
            <h3 className="font-heading text-2xl font-bold">AI Judge Panel Feedback</h3>
          </div>
          <p className="font-body text-muted-foreground">Your debate performance evaluation</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(debateData.scores).map(([skill, score]) => (
            <div key={skill} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className={`font-ui font-bold text-2xl ${getScoreColor(score)}`}>
                  {score}
                </span>
              </div>
              <p className="font-ui text-sm text-foreground font-medium">{skill}</p>
              <div className="mt-2">
                <Progress value={score * 20} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Quotes */}
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Evidence from Your Speech
          </h4>
          <div className="space-y-3">
            {debateData.evidence.map((quote, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-xl border-l-4 border-primary">
                <p className="font-body italic text-foreground">"{quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Strengths
            </h4>
            <div className="space-y-3">
              {debateData.strengths.map((strength, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-body text-green-800">{strength}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 flex items-center text-blue-700">
              <TrendingUp className="w-5 h-5 mr-2" />
              Areas to Improve
            </h4>
            <div className="space-y-3">
              {debateData.improvements.map((improvement, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-body text-blue-800">{improvement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GSL Reframe */}
        {debateData.gslReframe && (
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">GSL Speech Reframe</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-ui font-medium text-red-700 mb-3">Before (Original)</h5>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-body text-red-800">{debateData.gslReframe.before}</p>
                </div>
              </div>
              <div>
                <h5 className="font-ui font-medium text-green-700 mb-3">After (Improved)</h5>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-body text-green-800">{debateData.gslReframe.after}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badge Unlocks */}
        {debateData.badgeUnlocks.length > 0 && (
          <div className="text-center">
            <h4 className="font-heading font-semibold text-lg mb-4">Badges Unlocked!</h4>
            <div className="flex justify-center gap-3">
              {debateData.badgeUnlocks.map((badge, index) => (
                <Badge key={index} className="bg-primary text-primary-foreground px-4 py-2">
                  🏆 {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Interview type
  const interviewData = data as InterviewJudgeData;
  
  return (
    <div className="card-judge-panel space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-primary mr-3" />
          <h3 className="font-heading text-2xl font-bold">Recruiter Judge Panel</h3>
        </div>
        <div className="mb-4">
          <Badge className={`px-6 py-3 text-lg font-ui font-semibold border-2 ${getOverallColor(interviewData.overall)}`}>
            {interviewData.overall}
          </Badge>
        </div>
        <div className="text-center">
          <span className="font-ui text-2xl font-bold text-primary">
            Hireability Score: {interviewData.score}/10
          </span>
        </div>
      </div>

      {/* Competency Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(interviewData.competencies).map(([skill, score]) => (
          <div key={skill} className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className={`font-ui font-bold text-xl ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            <p className="font-ui text-sm text-foreground font-medium">{skill.replace(/([A-Z])/g, ' $1').trim()}</p>
            <div className="mt-2">
              <Progress value={score * 20} className="h-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Quotes */}
      <div>
        <h4 className="font-heading font-semibold text-lg mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Evidence from Your Answers
        </h4>
        <div className="space-y-3">
          {interviewData.evidence.map((quote, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-xl border-l-4 border-primary">
              <p className="font-body italic text-foreground">"{quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 flex items-center text-green-700">
            <CheckCircle className="w-5 h-5 mr-2" />
            Strengths
          </h4>
          <div className="space-y-3">
            {interviewData.strengths.map((strength, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-body text-green-800">{strength}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 flex items-center text-blue-700">
            <TrendingUp className="w-5 h-5 mr-2" />
            Areas to Improve
          </h4>
          <div className="space-y-3">
            {interviewData.improvements.map((improvement, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-body text-blue-800">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STAR Reframe */}
      {interviewData.starReframe && (
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4">STAR Method Reframe</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-ui font-medium text-red-700 mb-3">Before (Original Answer)</h5>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-body text-red-800">{interviewData.starReframe.before}</p>
              </div>
            </div>
            <div>
              <h5 className="font-ui font-medium text-green-700 mb-3">After (STAR Structure)</h5>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="font-body text-green-800">{interviewData.starReframe.after}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Action Plan */}
      <div>
        <h4 className="font-heading font-semibold text-lg mb-4">5-Day Action Plan</h4>
        <div className="space-y-3">
          {interviewData.actionPlan.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-ui font-bold text-sm">{item.day}</span>
              </div>
              <div>
                <p className="font-body text-foreground">{item.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Questions */}
      <div>
        <h4 className="font-heading font-semibold text-lg mb-4">Follow-up Questions to Practice</h4>
        <div className="space-y-3">
          {interviewData.followUps.map((question, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="font-body text-foreground">{question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};