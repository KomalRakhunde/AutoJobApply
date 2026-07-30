'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchPublicSession,
  startInterviewSession,
  completeInterviewSession,
  PublicSessionResponse,
} from '@/lib/interview-api';

interface Message {
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
}

export default function CandidateJoinInterviewPage({ params }: { params?: { token?: string } }) {
  const routeParams = useParams();
  const token = (routeParams?.token as string) || params?.token || '';

  const [sessionData, setSessionData] = useState<PublicSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeechText, setCurrentSpeechText] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Fetch session info by public token
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const res = await fetchPublicSession(token);
        setSessionData(res);
        setSecondsRemaining(res.session.maxDurationSeconds || 600);
      } catch (err: any) {
        setError('Invalid or expired interview session link.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [token]);

  // Handle countdown timer & auto-disconnect on time limit
  useEffect(() => {
    if (isJoined && !isCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleEndCall('Time limit reached. Call automatically wrapped up.');
            return 0;
          }
          if (prev === 60) {
            // Warn candidate and trigger AI wrap-up
            triggerAiMessage(
              "We are approaching the 10-minute limit. Thank you so much for answering these questions today! Do you have any quick final remarks before we conclude?"
            );
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isJoined, isCompleted]);

  // Speech Synth helper for AI Voice
  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    setIsAiSpeaking(true);
    utterance.onend = () => {
      setIsAiSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsAiSpeaking(false);
      onEnd?.();
    };
    window.speechSynthesis.speak(utterance);
  };

  const triggerAiMessage = (text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'ai', text, timestamp: timeStr }]);
    speakText(text);
  };

  // Join Voice Call
  const handleJoinCall = async () => {
    if (!sessionData) return;
    setIsJoined(true);
    await startInterviewSession(sessionData.session.id);

    const ctx = sessionData.session.questionContext;
    const name = ctx?.candidateName || sessionData.session.candidateName || 'Candidate';
    const role = sessionData.session.jobTitle || 'the role';

    // Initial Resume-Aware AI Greeting
    const greeting = `Hello ${name}! Welcome to your AI voice screening interview for ${role} at ApplyAI. I've reviewed your resume and noticed your experience with ${
      ctx?.candidateSkills?.slice(0, 3).join(', ') || 'software engineering'
    }. To start off, could you tell me more about your recent project and how you applied these skills?`;

    setTimeout(() => {
      triggerAiMessage(greeting);
    }, 800);

    // Initialize Browser Web Speech Recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentSpeechText(transcript);

        if (event.results[event.results.length - 1].isFinal) {
          const finalCandidateText = transcript.trim();
          if (finalCandidateText.length > 2) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prev) => [...prev, { sender: 'candidate', text: finalCandidateText, timestamp: timeStr }]);
            setCurrentSpeechText('');
            generateNextAiResponse(finalCandidateText, ctx);
          }
        }
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
      };

      try {
        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        console.warn('Speech recognition failed to start:', err);
      }
    }
  };

  // Generate dynamic resume-aware next question
  const generateNextAiResponse = (candidateReply: string, ctx: any) => {
    setTimeout(() => {
      let nextQuestion = '';
      const replyLower = candidateReply.toLowerCase();

      if (replyLower.includes('project') || replyLower.includes('built') || replyLower.includes('system')) {
        nextQuestion = `That's impressive. In your resume, you mentioned work related to ${
          ctx?.strengths?.[0] || 'software architecture'
        }. What was the most challenging technical tradeoff you had to make on that project?`;
      } else if (replyLower.includes('team') || replyLower.includes('lead') || replyLower.includes('scale')) {
        nextQuestion = `Great insight. How do you handle code reviews and ensure engineering quality across your team when working on high-priority deadlines?`;
      } else {
        nextQuestion = `Thank you for sharing that context. Looking at the requirements for ${ctx?.jobTitle || 'this role'}, how do you approach debugging complex production issues when performance bottlenecks arise?`;
      }

      triggerAiMessage(nextQuestion);
    }, 1200);
  };

  // End Call & Submit Transcript
  const handleEndCall = async (reason?: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsJoined(false);
    setIsCompleted(true);

    if (sessionData) {
      const fullTranscript = messages.map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n');
      const durationSeconds = (sessionData.session.maxDurationSeconds || 600) - secondsRemaining;
      await completeInterviewSession(sessionData.session.id, fullTranscript || 'Interview call completed.', durationSeconds);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
          <p className="text-sm font-semibold">Connecting to AI Voice Screening Session...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800 p-6 text-center space-y-4 rounded-2xl">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold">Invalid or Expired Link</h2>
          <p className="text-xs text-slate-400">
            {error || 'This interview link is no longer active. Please contact your recruiter.'}
          </p>
        </Card>
      </div>
    );
  }

  const { session } = sessionData;
  const ctx = session.questionContext;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">ApplyAI Autonomous Voice Agent</h1>
              <p className="text-xs text-slate-400">Resume-Aware Voice Screening Protocol</p>
            </div>
          </div>

          <Badge className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs px-3 py-1 font-mono">
            <Clock className="h-3.5 w-3.5 mr-1 text-indigo-400" />
            <span>Max {Math.round(session.maxDurationSeconds / 60)} Mins</span>
          </Badge>
        </div>

        {/* State 1: Pre-Join Room Card */}
        {!isJoined && !isCompleted && (
          <Card className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                OFFICIAL APPLICANT SCREENING
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {session.jobTitle}
              </h2>
              <p className="text-xs text-slate-400">
                Applicant: <span className="font-bold text-slate-200">{session.candidateName}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-900/50 bg-indigo-950/30 p-4 space-y-2 text-xs text-indigo-200">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>AI Screening Notice</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                This interview is conducted by our AI voice agent tailored to your resume qualifications.
                Please ensure you are in a quiet environment with your microphone enabled.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Topics Covered From Your Resume:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ctx?.candidateSkills?.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300"
                  >
                    {skill}
                  </span>
                )) || <span className="text-xs text-slate-400">Technical experience & architecture</span>}
              </div>
            </div>

            <Button
              onClick={handleJoinCall}
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/30 text-sm gap-2"
            >
              <Mic className="h-5 w-5" />
              <span>Join AI Voice Interview Now</span>
            </Button>
          </Card>
        )}

        {/* State 2: Active Voice Call Interface */}
        {isJoined && !isCompleted && (
          <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Top Call Info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  {isAiSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Interviewer</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {isAiSpeaking ? 'Speaking...' : 'Listening to candidate...'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Time Remaining</span>
                <p className={`text-xl font-mono font-extrabold ${secondsRemaining <= 60 ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`}>
                  {formatTime(secondsRemaining)}
                </p>
              </div>
            </div>

            {/* Conversation Messages Container */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 scrollbar-none">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${m.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="h-7 w-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-md space-y-1 ${
                      m.sender === 'ai'
                        ? 'bg-slate-800 text-slate-100 border border-slate-700'
                        : 'bg-indigo-600 text-white font-medium'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <span className="text-[9px] text-slate-400 block text-right">{m.timestamp}</span>
                  </div>
                  {m.sender === 'candidate' && (
                    <div className="h-7 w-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {currentSpeechText && (
                <div className="flex justify-end gap-3 text-xs opacity-75">
                  <div className="p-3 rounded-2xl bg-indigo-950 border border-indigo-800 text-indigo-200 animate-pulse">
                    <p className="italic">{currentSpeechText}...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Controls Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMicMuted(!micMuted)}
                className={`rounded-xl text-xs gap-1.5 ${micMuted ? 'border-rose-500 text-rose-500' : 'border-slate-700 text-slate-300'}`}
              >
                {micMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{micMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
              </Button>

              <Button
                onClick={() => handleEndCall('User requested call termination')}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold gap-1.5 px-5"
              >
                <PhoneOff className="h-4 w-4" />
                <span>Conclude Interview</span>
              </Button>
            </div>
          </Card>
        )}

        {/* State 3: Completed Interview Summary Card */}
        {isCompleted && (
          <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 text-center shadow-2xl">
            <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Interview Concluded</h2>
              <p className="text-xs text-slate-400">
                Thank you, {session.candidateName}! Your interview transcript has been recorded and submitted to the hiring team.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left space-y-2 max-h-48 overflow-y-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transcript Preview</span>
              {messages.map((m, i) => (
                <p key={i} className="text-[11px] text-slate-300">
                  <strong className="text-indigo-400">{m.sender.toUpperCase()}:</strong> {m.text}
                </p>
              ))}
            </div>

            <p className="text-[11px] text-slate-500">You may now close this browser tab.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
