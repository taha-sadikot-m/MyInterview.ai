import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  onTranscriptUpdate?: (transcript: string) => void;
  placeholder?: string;
  maxDuration?: number;
}

export const VoiceRecorder = ({ 
  onRecordingComplete,
  onTranscriptUpdate,
  placeholder = "Press the mic to start recording",
  maxDuration = 90
}: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process all results from the current recognition session
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        // Only use the current session's transcript, don't accumulate from previous sessions
        const currentTranscript = finalTranscript + interimTranscript;
        setTranscript(currentTranscript);
        onTranscriptUpdate?.(currentTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, [transcript, isRecording, onTranscriptUpdate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        onRecordingComplete(audioBlob, transcript);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setTranscript("");
      
      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsTranscribing(true);
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }
      
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsTranscribing(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {!isRecording && !audioUrl && (
            <p className="text-sm text-gray-600 text-center">{placeholder}</p>
          )}
          
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              className="rounded-full h-16 w-16"
            >
              {isRecording ? <Square size={24} /> : <Mic size={24} />}
            </Button>
          </div>
          
          {(isRecording || audioUrl) && (
            <div className="text-center">
              <p className="text-sm font-medium">
                {isRecording ? 'Recording...' : 'Recorded'} {formatTime(duration)}
              </p>
              {maxDuration && (
                <p className="text-xs text-gray-500">
                  Max: {formatTime(maxDuration)}
                </p>
              )}
            </div>
          )}
          
          {isTranscribing && (
            <div className="text-center">
              <p className="text-xs text-blue-600">Transcribing in real-time...</p>
            </div>
          )}
          
          {audioUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAudioUrl(null);
                setTranscript("");
                setDuration(0);
                setIsPlaying(false);
              }}
              className="text-xs"
            >
              Record Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
