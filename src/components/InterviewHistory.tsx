import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Star,
  Download,
  Eye,
  BarChart3,
  FileText,
  Award,
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type MockInterview = Database['public']['Tables']['mock_interviews']['Row'];
type InterviewChat = Database['public']['Tables']['interview_chats']['Row'];

interface InterviewHistoryProps {
  userId: string;
}

const InterviewHistory = ({ userId }: InterviewHistoryProps) => {
  const [interviews, setInterviews] = useState<MockInterview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<MockInterview | null>(null);
  const [chatHistory, setChatHistory] = useState<InterviewChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  const fetchInterviews = async () => {
    try {
      console.log('[InterviewHistory] Fetching interviews for user:', userId);
      
      const { data, error } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('[InterviewHistory] Database error:', error);
        setError(`Database error: ${error.message}`);
        throw error;
      }
      
      console.log('[InterviewHistory] Fetched interviews:', data?.length || 0, 'records');
      setInterviews(data || []);
      
      if (data && data.length === 0) {
        console.log('[InterviewHistory] No interviews found for user:', userId);
      }
    } catch (error) {
      console.error('[InterviewHistory] Error fetching interviews:', error);
      setError(`Failed to load interviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    try {
      console.log('[InterviewHistory] Creating sample interview data...');
      
      const sampleInterview = {
        user_id: userId,
        company_name: 'Sample Company',
        role_title: 'Software Engineer',
        interview_type: 'predefined' as const,
        status: 'completed' as const,
        total_questions: 5,
        questions_answered: 5,
        overall_score: 7.5,
        competency_scores: {
          Communication: 8,
          StructuredThinkingSTAR: 7,
          TechnicalFundamentals: 8,
          ProblemSolving: 7,
          CultureOwnership: 8,
          Coachability: 7
        },
        strengths: ['Clear communication', 'Strong technical background'],
        improvements: ['Use STAR framework more consistently'],
        feedback_summary: 'Good performance overall with room for improvement in structured thinking.',
        questions: [
          { question: 'Tell me about yourself', follow_up: [] },
          { question: 'Why do you want to work here?', follow_up: [] }
        ],
        started_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        completed_at: new Date(Date.now() - 86000000).toISOString(), // ~24 hours ago
      };

      const { data, error } = await supabase
        .from('mock_interviews')
        .insert([sampleInterview])
        .select()
        .single();

      if (error) {
        console.error('[InterviewHistory] Error creating sample data:', error);
        throw error;
      }

      console.log('[InterviewHistory] Sample data created:', data);
      // Refresh the interviews list
      fetchInterviews();
      
    } catch (error) {
      console.error('[InterviewHistory] Failed to create sample data:', error);
    }
  };

  const fetchChatHistory = async (interviewId: string) => {
    setChatLoading(true);
    try {
      console.log('[InterviewHistory] Fetching interview conversation for interview:', interviewId);
      
      // Fetch questions and responses from the interview tables
      const { data: questionsData, error: questionsError } = await supabase
        .from('interview_questions')
        .select(`
          id,
          question_text,
          order_index,
          interview_responses (
            id,
            response_text,
            responded_at
          )
        `)
        .eq('mock_interview_id', interviewId)
        .order('order_index', { ascending: true });

      if (questionsError) {
        console.error('[InterviewHistory] Questions fetch error:', questionsError);
        throw questionsError;
      }
      
      console.log('[InterviewHistory] Fetched questions and responses:', questionsData?.length || 0, 'records');
      
      // Convert to chat format for display
      const chatMessages: any[] = [];
      let messageOrder = 1;
      
      if (questionsData) {
        questionsData.forEach((question: any) => {
          // Add question message
          chatMessages.push({
            id: `q-${question.id}`,
            mock_interview_id: interviewId,
            message_type: 'question',
            sender: 'ai',
            content: question.question_text,
            message_order: messageOrder++,
            metadata: null,
            created_at: new Date().toISOString()
          });
          
          // Add response message if exists
          if (question.interview_responses && question.interview_responses.length > 0) {
            const response = question.interview_responses[0]; // Take first response
            chatMessages.push({
              id: `r-${response.id}`,
              mock_interview_id: interviewId,
              message_type: 'response',
              sender: 'user',
              content: response.response_text,
              message_order: messageOrder++,
              metadata: null,
              created_at: response.responded_at || new Date().toISOString()
            });
          }
        });
      }
      
      setChatHistory(chatMessages);
    } catch (error) {
      console.error('[InterviewHistory] Error fetching interview conversation:', error);
      setChatHistory([]);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'abandoned':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startDate: string, endDate: string | null) => {
    if (!endDate) return "In Progress";
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Interview History</h2>
          <p className="text-muted-foreground">Loading your interview history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Interview History</h2>
        </div>
        <Card className="text-center p-12">
          <CardContent>
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">Unable to Load History</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchInterviews} className="btn-primary">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-bold mb-4">Interview History</h2>
        <p className="text-muted-foreground">
          Track your progress and review past interview sessions
        </p>
      </div>

      {interviews.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">No Interviews Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your first mock interview to see your history here
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="btn-primary">Start New Interview</Button>
              <Button variant="outline" onClick={createSampleData}>
                Create Sample Data (Debug)
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-ui text-sm font-medium">Total Interviews</span>
                </div>
                <p className="font-heading text-2xl font-bold mt-2">{interviews.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-ui text-sm font-medium">Completed</span>
                </div>
                <p className="font-heading text-2xl font-bold mt-2">
                  {interviews.filter(i => i.status === 'completed').length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="font-ui text-sm font-medium">Avg Score</span>
                </div>
                <p className="font-heading text-2xl font-bold mt-2">
                  {interviews.filter(i => i.overall_score).length > 0
                    ? (interviews.filter(i => i.overall_score).reduce((sum, i) => sum + (i.overall_score || 0), 0) /
                       interviews.filter(i => i.overall_score).length).toFixed(1)
                    : "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-ui text-sm font-medium">Best Score</span>
                </div>
                <p className="font-heading text-2xl font-bold mt-2">
                  {Math.max(...interviews.filter(i => i.overall_score).map(i => i.overall_score || 0)).toFixed(1) !== "-Infinity" 
                    ? Math.max(...interviews.filter(i => i.overall_score).map(i => i.overall_score || 0)).toFixed(1)
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interview List */}
          <div className="space-y-4">
            {interviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(interview.status)}
                        <h3 className="font-heading text-lg font-semibold">
                          {interview.role_title} at {interview.company_name}
                        </h3>
                        <Badge variant={interview.interview_type === 'custom' ? 'default' : 'secondary'}>
                          {interview.interview_type === 'custom' ? 'Custom' : 'Predefined'}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(interview.started_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDuration(interview.started_at, interview.completed_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {interview.questions_answered}/{interview.total_questions} questions
                        </div>
                      </div>

                      {interview.overall_score && (
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span className="text-sm font-medium">Overall Score:</span>
                            <span className={`font-bold ${getScoreColor(interview.overall_score)}`}>
                              {interview.overall_score.toFixed(1)}/10
                            </span>
                          </div>
                          <Progress 
                            value={interview.overall_score * 10} 
                            className="w-32 h-2" 
                          />
                        </div>
                      )}

                      {interview.strengths && interview.strengths.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {interview.strengths.slice(0, 3).map((strength, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInterview(interview);
                              fetchChatHistory(interview.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {selectedInterview?.role_title} at {selectedInterview?.company_name}
                            </DialogTitle>
                            <DialogDescription>
                              Interview conducted on {selectedInterview && formatDate(selectedInterview.started_at)}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedInterview && (
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="conversation">Conversation</TabsTrigger>
                                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                              </TabsList>

                              <TabsContent value="overview" className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Performance Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {selectedInterview.overall_score && (
                                        <div className="text-center">
                                          <div className={`text-3xl font-bold ${getScoreColor(selectedInterview.overall_score)}`}>
                                            {selectedInterview.overall_score.toFixed(1)}/10
                                          </div>
                                          <p className="text-muted-foreground">Overall Score</p>
                                        </div>
                                      )}
                                      
                                      {selectedInterview.competency_scores && 
                                        typeof selectedInterview.competency_scores === 'object' &&
                                        !Array.isArray(selectedInterview.competency_scores) && (
                                        <div className="space-y-3">
                                          {Object.entries(selectedInterview.competency_scores as Record<string, number>).map(([skill, score]) => (
                                            <div key={skill} className="space-y-1">
                                              <div className="flex justify-between text-sm">
                                                <span className="capitalize">{skill.replace(/_/g, ' ')}</span>
                                                <span className="font-medium">{score}/10</span>
                                              </div>
                                              <Progress value={Number(score) * 10} className="h-2" />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Interview Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex justify-between">
                                        <span>Duration:</span>
                                        <span className="font-medium">
                                          {formatDuration(selectedInterview.started_at, selectedInterview.completed_at)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Questions:</span>
                                        <span className="font-medium">
                                          {selectedInterview.questions_answered}/{selectedInterview.total_questions}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Type:</span>
                                        <Badge variant={selectedInterview.interview_type === 'custom' ? 'default' : 'secondary'}>
                                          {selectedInterview.interview_type === 'custom' ? 'Custom' : 'Predefined'}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Status:</span>
                                        <div className="flex items-center gap-2">
                                          {getStatusIcon(selectedInterview.status)}
                                          <span className="capitalize">{selectedInterview.status.replace('_', ' ')}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {selectedInterview.feedback_summary && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-muted-foreground leading-relaxed">
                                        {selectedInterview.feedback_summary}
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                              </TabsContent>

                              <TabsContent value="conversation" className="space-y-4">
                                {chatLoading ? (
                                  <div className="text-center py-8">
                                    <p className="text-muted-foreground">Loading conversation...</p>
                                  </div>
                                ) : (
                                  <ScrollArea className="h-96 w-full border rounded-lg p-4">
                                    <div className="space-y-4">
                                      {chatHistory.map((message) => (
                                        <div 
                                          key={message.id}
                                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                          <div className={`max-w-[80%] p-3 rounded-lg ${
                                            message.sender === 'user' 
                                              ? 'bg-primary text-primary-foreground ml-4' 
                                              : 'bg-muted mr-4'
                                          }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-medium capitalize">
                                                {message.sender === 'ai' ? 'Interviewer' : 'You'}
                                              </span>
                                              <Badge variant="outline" className="text-xs">
                                                {message.message_type}
                                              </Badge>
                                            </div>
                                            <p className="text-sm">{message.content}</p>
                                            {message.metadata && typeof message.metadata === 'object' && 'duration' in message.metadata && (
                                              <p className="text-xs opacity-70 mt-1">
                                                Duration: {String(message.metadata.duration)}s
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                )}
                              </TabsContent>

                              <TabsContent value="feedback" className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  {selectedInterview.strengths && selectedInterview.strengths.length > 0 && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg text-green-600">Strengths</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <ul className="space-y-2">
                                          {selectedInterview.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                              <span className="text-sm">{strength}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {selectedInterview.improvements && selectedInterview.improvements.length > 0 && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg text-amber-600">Areas for Improvement</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <ul className="space-y-2">
                                          {selectedInterview.improvements.map((improvement, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                              <span className="text-sm">{improvement}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;