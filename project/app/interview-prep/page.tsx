'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Loader2,
  Mic,
  Briefcase,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Settings,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useInterviewQuestions } from '@/lib/hooks/use-features';
import type { InterviewQuestionsResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName } from '@/lib/utils';

// Custom Semi-Circle SVG Gauge Meter for PACE
function PaceGauge({ wpm = 145 }: { wpm?: number }) {
  const minWpm = 80;
  const maxWpm = 200;
  const normalized = Math.min(Math.max((wpm - minWpm) / (maxWpm - minWpm), 0), 1);
  // angle range: -150 to -30 degrees in SVG coordinates
  const angleDeg = -150 + normalized * 120;
  const angleRad = (angleDeg * Math.PI) / 180;
  
  const cx = 60;
  const cy = 52;
  const r = 40;
  const needleLength = 30;
  const nx = cx + needleLength * Math.cos(angleRad);
  const ny = cy + needleLength * Math.sin(angleRad);

  return (
    <div className="flex flex-col items-center justify-center py-1">
      <div className="relative w-44 h-20 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 120 65" className="w-full h-full">
          {/* Background Arc Track */}
          <path
            d="M 20 52 A 40 40 0 0 1 100 52"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Active Target Zone Arc (Emerald Green Ideal Range) */}
          <path
            d="M 45 23 A 40 40 0 0 1 75 23"
            fill="none"
            stroke="currentColor"
            strokeWidth="7.5"
            strokeLinecap="round"
            className="text-emerald-500"
          />
          {/* Pivot Point */}
          <circle cx={cx} cy={cy} r="3.5" className="fill-slate-800 dark:fill-white" />
          {/* Gauge Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-slate-900 dark:text-white transition-all duration-500 ease-out"
          />
        </svg>
      </div>
      <span className="font-black text-xs text-slate-900 dark:text-white mt-1">
        {wpm} WPM (Ideal)
      </span>
    </div>
  );
}

const sampleQuestions = [
  {
    text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Optimize for O(N) time complexity using a Hash Map.",
    category: "Coding",
    tip: "Explain your space-time trade-off clearly. Mention why a hash lookup gives O(1) time complexity compared to two nested loops O(N²).",
    keywords: ['Hash Map', 'O(N) Time', 'Array Indexing', 'Lookup', 'Optimization'],
    missing: ['Two-Pointers', 'Edge Cases'],
  },
  {
    text: "Design a scalable URL Shortening Service (like bit.ly) capable of handling 100 Million daily active redirects with sub-50ms latency under high load.",
    category: "Scenario Questions",
    tip: "Break down your architecture into API Gateway, Hash Encoding (Base62), Distributed Caching (Redis), and Database Sharding.",
    keywords: ['Base62 Encoding', 'Redis Cache', 'Database Sharding', 'CDN', 'Rate Limiter'],
    missing: ['Consistent Hashing', 'Bloom Filters'],
  },
  {
    text: "Tell me about a time you had to handle a difficult project requirement or technical disagreement within your engineering team. How did you resolve it?",
    category: "HR",
    tip: "Follow the **STAR Method** (Situation, Task, Action, Result). Quantify your positive team outcome and leadership skills.",
    keywords: ['STAR Method', 'Conflict Resolution', 'Active Listening', 'Consensus', 'Leadership'],
    missing: ['Quantifiable Result', 'Empathy'],
  },
  {
    text: "How does the Node.js Event Loop work under the hood, and how do Microtasks differ from Macrotasks in asynchronous execution?",
    category: "Technical",
    tip: "Discuss libuv, call stack, process.nextTick vs Promise.then microtasks, and setTimeout/setImmediate macrotasks.",
    keywords: ['Event Loop', 'Libuv', 'Microtask Queue', 'Non-blocking I/O', 'Promises'],
    missing: ['Worker Threads', 'Process.nextTick'],
  },
];

function InterviewPrepContent() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const searchParams = useSearchParams();

  // Context State
  const [jobTitle, setJobTitle] = useState('Full Stack Software Engineer');
  const [companyName, setCompanyName] = useState('Target Company');
  const [location, setLocation] = useState('Remote');
  const [roundType, setRoundType] = useState('Technical & Behavioral Round');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Technical' | 'HR' | 'Coding' | 'Scenario Questions'>('All');

  // Category Pills
  const categories = ['All', 'Technical', 'HR', 'Coding', 'Scenario Questions'] as const;
  const [isEditContextOpen, setIsEditContextOpen] = useState(false);

  // Question & Session State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const totalMaxSeconds = 1200; // 20:00

  // Metrics State
  const [clarityScore, setClarityScore] = useState(0);
  const [paceWpm, setPaceWpm] = useState(140);

  const formattedUsername = getDisplayName(user);

  // Live Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => (prev >= totalMaxSeconds ? totalMaxSeconds : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    const next = !isRecording;
    setIsRecording(next);
    toast({
      title: next ? '🎙️ Mic Active (Recording)' : '⏸️ Session Paused',
      description: next
        ? 'Real-time AI audio evaluation running...'
        : 'Session paused. Click mic button to resume.',
    });
  };

  const activeQ = sampleQuestions[currentQuestionIdx];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIdx((prev) => (prev + 1) % sampleQuestions.length);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIdx((prev) => (prev - 1 + sampleQuestions.length) % sampleQuestions.length);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header & Category Filter Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Interview Preparation Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Practice real-time technical, system design, and behavioral interview simulations.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-[#121522] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const foundIdx = sampleQuestions.findIndex((q) => cat === 'All' || q.category === cat);
                  if (foundIdx !== -1) setCurrentQuestionIdx(foundIdx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Live Session Workspace (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 sm:p-8 space-y-8 shadow-sm text-center min-h-[530px] flex flex-col justify-between">
              
              {/* Top Live Session Pill */}
              <div className="flex justify-center">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-1.5 rounded-full gap-2 shadow-sm tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span>LIVE SESSION</span>
                </Badge>
              </div>

              {/* Mic Button & Waveform Container */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <button
                    onClick={toggleRecording}
                    title={isRecording ? 'Pause Recording' : 'Start Recording'}
                    className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 ${
                      isRecording
                        ? 'bg-rose-600 shadow-rose-500/40 scale-105 ring-4 ring-rose-300 dark:ring-rose-900/50'
                        : 'bg-blue-600 shadow-blue-500/30 hover:scale-105'
                    }`}
                  >
                    <Mic className="h-10 w-10" />
                  </button>
                </div>

                {/* Audio Waveform Bar Graphic */}
                <div className="flex items-center justify-center gap-1.5 h-10">
                  {[40, 75, 35, 95, 55, 85, 45, 100, 65, 35, 85, 55, 95, 45].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1.5 bg-blue-600 rounded-full transition-all duration-300 ${
                        isRecording ? 'animate-pulse' : ''
                      }`}
                      style={{
                        height: isRecording ? `${h}%` : '20%',
                        animationDelay: `${i * 70}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Current Question & Speaker Prompt */}
                <div className="space-y-3 max-w-xl mx-auto">
                  <p className="text-xs font-bold text-slate-400">Speak naturally, {formattedUsername}</p>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    "{activeQ.text}"
                  </h3>

                  {/* Question Switcher Controls */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevQuestion}
                      className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Prev Question
                    </Button>
                    <span className="text-[11px] font-bold text-slate-400">
                      {currentQuestionIdx + 1} of {sampleQuestions.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNextQuestion}
                      className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl"
                    >
                      Next Question
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Real-Time Evaluation Tip Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-left flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 mt-0.5">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                    REAL-TIME EVALUATE TIP
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {activeQ.tip}
                  </p>
                </div>
              </div>

              {/* Bottom Control Bar Container */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {jobTitle}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {companyName} • {location} • {roundType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditContextOpen(true)}
                    className="rounded-xl text-xs font-bold border-slate-200 dark:border-slate-700"
                  >
                    Edit Context
                  </Button>
                  <Button
                    size="sm"
                    onClick={toggleRecording}
                    className={`rounded-xl font-bold text-xs ${
                      isRecording
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isRecording ? 'End Session' : 'Start Session'}
                  </Button>
                </div>
              </div>

            </Card>
          </div>

          {/* RIGHT COLUMN: Speech Evaluation Metrics (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Card 1: CLARITY */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">CLARITY</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">{clarityScore}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${clarityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Enunciation is excellent. Minimal filler words detected.
              </p>
            </Card>

            {/* Card 2: PACE */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">PACE</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Steady</span>
              </div>
              <PaceGauge wpm={paceWpm} />
            </Card>

            {/* Card 3: TOP KEYWORDS USED & MISSING HITS */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                TOP KEYWORDS USED
              </span>
              
              <div className="flex flex-wrap gap-1.5">
                {activeQ.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  MISSING HITS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeQ.missing.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-0.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 font-bold text-[10px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Card 4: SESSION OVERVIEW (Dark Navy Card) */}
            <Card className="rounded-3xl border border-slate-800 bg-[#0c0e17] text-white p-6 space-y-3.5 shadow-xl">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                SESSION OVERVIEW
              </span>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Time Elapsed</span>
                <span className="font-bold text-white font-mono">{formatTime(elapsedSeconds)} / {formatTime(totalMaxSeconds)}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Questions Answered</span>
                <span className="font-bold text-white font-mono">{currentQuestionIdx + 1} / {sampleQuestions.length}</span>
              </div>
            </Card>

          </div>

        </div>
      </div>

      {/* Edit Session Context Dialog Modal */}
      <Dialog open={isEditContextOpen} onOpenChange={setIsEditContextOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Interview Context</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Customize target role and company details to tailor AI interview evaluation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Job Title</Label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Product Analyst"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Company</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Location / Remote</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mountain View (Remote)"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Round Type</Label>
              <Input
                value={roundType}
                onChange={(e) => setRoundType(e.target.value)}
                placeholder="e.g. Behavioral Round"
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setIsEditContextOpen(false);
                toast({ title: 'Interview Context Updated' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl w-full"
            >
              Save Context
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading Interview Studio...</div>}>
      <InterviewPrepContent />
    </Suspense>
  );
}

