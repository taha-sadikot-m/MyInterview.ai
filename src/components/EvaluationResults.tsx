import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Download,
  FileText,
  Calendar,
  Clock,
  BarChart3,
  Lightbulb,
  BookOpen,
  Award
} from "lucide-react";

interface EvaluationData {
  overall_score: number;
  competency_scores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  feedback_summary: string;
  star_examples: Array<{
    category: string;
    before: string;
    after: string;
  }>;
  action_plan: Array<{
    day: number;
    task: string;
    category: string;
  }>;
  detailed_feedback: Array<{
    question: string;
    answer_quality: number;
    feedback: string;
    suggestions: string[];
  }>;
}

interface EvaluationResultsProps {
  evaluation: EvaluationData;
  interviewData: {
    company: string;
    role: string;
    date: string;
    duration: string;
    questionsAnswered: number;
    totalQuestions: number;
  };
  onDownloadPDF: () => void;
  onRetakeInterview?: () => void;
}

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({
  evaluation,
  interviewData,
  onDownloadPDF,
  onRetakeInterview
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600";
    if (score >= 7.0) return "text-yellow-600";
    if (score >= 5.5) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8.5) return "default";
    if (score >= 7.0) return "secondary";
    return "destructive";
  };

  const getOverallRecommendation = (score: number) => {
    if (score >= 8.5) return { text: "Strong Hire", icon: Trophy, color: "text-green-600" };
    if (score >= 7.0) return { text: "Hire", icon: CheckCircle, color: "text-yellow-600" };
    if (score >= 5.5) return { text: "Maybe", icon: AlertTriangle, color: "text-orange-600" };
    return { text: "No Hire", icon: AlertTriangle, color: "text-red-600" };
  };

  const recommendation = getOverallRecommendation(evaluation.overall_score);
  const RecommendationIcon = recommendation.icon;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="font-heading text-3xl font-bold">Interview Evaluation Results</h1>
        </div>
        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{interviewData.company} - {interviewData.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{interviewData.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{interviewData.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>{interviewData.questionsAnswered}/{interviewData.totalQuestions} Questions</span>
          </div>
        </div>
      </div>

      {/* Overall Score Section */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <RecommendationIcon className={`w-12 h-12 ${recommendation.color}`} />
            <div>
              <CardTitle className="text-2xl">Overall Score</CardTitle>
              <CardDescription>Your interview performance evaluation</CardDescription>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-6xl font-bold text-primary">
              {evaluation.overall_score.toFixed(1)}/10
            </div>
            <Badge 
              variant={getScoreBadgeVariant(evaluation.overall_score)} 
              className="text-lg px-4 py-2"
            >
              {recommendation.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {evaluation.feedback_summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={onDownloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
        {onRetakeInterview && (
          <Button variant="outline" onClick={onRetakeInterview} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Retake Interview
          </Button>
        )}
      </div>

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="competencies" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="competencies">Competencies</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
        </TabsList>

        {/* Competencies Tab */}
        <TabsContent value="competencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Competency Breakdown
              </CardTitle>
              <CardDescription>
                Your performance across key interview competencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {Object.entries(evaluation.competency_scores).map(([competency, score]) => (
                  <div key={competency} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{competency.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={score * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strengths Tab */}
        <TabsContent value="strengths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Strengths
              </CardTitle>
              <CardDescription>
                Areas where you performed exceptionally well
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {evaluation.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Areas for Improvement
              </CardTitle>
              <CardDescription>
                Opportunities to enhance your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {evaluation.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{improvement}</span>
                  </div>
                ))}
              </div>

              {/* STAR Examples */}
              {evaluation.star_examples && evaluation.star_examples.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    STAR Methodology Examples
                  </h4>
                  {evaluation.star_examples.map((example, index) => (
                    <Card key={index} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">{example.category}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-red-50 rounded border border-red-200">
                          <h5 className="font-medium text-red-800 mb-2">❌ Before (Weak Response):</h5>
                          <p className="text-red-700 text-sm">{example.before}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded border border-green-200">
                          <h5 className="font-medium text-green-800 mb-2">✅ After (STAR Format):</h5>
                          <p className="text-green-700 text-sm">{example.after}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Question-by-Question Feedback
              </CardTitle>
              <CardDescription>
                Detailed analysis of each response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {evaluation.detailed_feedback.map((feedback, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{feedback.question}</CardTitle>
                          <Badge variant={getScoreBadgeVariant(feedback.answer_quality)}>
                            {feedback.answer_quality.toFixed(1)}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">{feedback.feedback}</p>
                        <div>
                          <h5 className="font-medium mb-2">Suggestions:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {feedback.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Plan Tab */}
        <TabsContent value="action-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Personalized Action Plan
              </CardTitle>
              <CardDescription>
                Step-by-step improvement roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evaluation.action_plan.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {item.day}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.task}</p>
                      <Badge variant="outline" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvaluationResults;