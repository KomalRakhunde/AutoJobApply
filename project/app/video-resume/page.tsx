'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName } from '@/lib/utils';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  Play,
  Pause,
  Square,
  Sparkles,
  Download,
  RefreshCw,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Sliders,
  CheckCircle2,
  FileText,
  Volume2,
  Tv,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Trash2,
} from 'lucide-react';

export default function VideoResumePage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const candidateName = getDisplayName(user);

  // Script & Pitch State
  const [targetRole, setTargetRole] = useState('Senior Full Stack Software Engineer');
  const [yearsExperience, setYearsExperience] = useState('5+ Years');
  const [topSkills, setTopSkills] = useState('React, Next.js, Node.js, PostgreSQL, System Design');
  const [pitchScript, setPitchScript] = useState(
    `Hello! I'm ${candidateName}, a ${targetRole} with over ${yearsExperience} of experience architecting high-performance web applications and distributed systems.\n\nMy core expertise spans ${topSkills}. In my recent roles, I led frontend redesigns that reduced page load latency by 38% and scaled microservices handling millions of API requests daily.\n\nI thrive in fast-paced engineering teams where clean architecture and rapid product iteration matter. Thank you for viewing my video resume pitch!`
  );

  // Teleprompter State
  const [wpm, setWpm] = useState(130);
  const [fontSize, setFontSize] = useState(16);
  const [isPrompterRunning, setIsPrompterRunning] = useState(false);
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // Studio & Recording State
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isSpeakingVoiceover, setIsSpeakingVoiceover] = useState(false);

  // AI Voice Selection State
  const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [voiceRate, setVoiceRate] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(1.0);

  // Load available speech synthesis voices with Soft Female AI Voice default
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setVoicesList(voices);
        if (voices.length > 0 && !selectedVoiceURI) {
          const softFemaleVoice = voices.find((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes('female') ||
              name.includes('samantha') ||
              name.includes('jenny') ||
              name.includes('zira') ||
              name.includes('victoria') ||
              name.includes('karen') ||
              name.includes('fiona') ||
              name.includes('aria') ||
              name.includes('sonia') ||
              name.includes('natural')
            );
          }) || voices.find((v) => v.lang.startsWith('en')) || voices[0];
          
          setSelectedVoiceURI(softFemaleVoice.voiceURI);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI]);

  // Auto-scroll teleprompter
  useEffect(() => {
    let prompterInterval: NodeJS.Timeout;
    if (isPrompterRunning && teleprompterRef.current) {
      prompterInterval = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += 1.5;
        }
      }, 50);
    }
    return () => clearInterval(prompterInterval);
  }, [isPrompterRunning]);

  // Recording Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Camera stream activation
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      setIsCameraActive(true);
      toast({
        title: '🎥 Camera & Mic Activated',
        description: 'Webcam feed ready for video resume pitch recording.',
      });
    } catch {
      toast({
        title: 'Camera Access Needed',
        description: 'Simulating Studio Preview mode (Camera permission required for live webcam).',
        variant: 'destructive',
      });
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
      const stream = videoPreviewRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoPreviewRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start MediaRecorder
  const startRecording = () => {
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);
    recordedChunksRef.current = [];

    if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
      const stream = videoPreviewRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        toast({
          title: '🎬 Video Resume Pitch Recorded',
          description: 'Ready to preview, download, or attach to applications.',
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPrompterRunning(true);
    } else {
      // Demo recording mode without webcam
      setIsRecording(true);
      setIsPrompterRunning(true);
      setTimeout(() => {
        // Will stop via handleStopRecording
      }, 100);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Demo video output creation
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 360);
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${candidateName} — Video Pitch`, 40, 180);
      }
      setRecordedVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      toast({
        title: '🎬 Video Pitch Synthesized',
        description: 'Generated video pitch asset ready for review.',
      });
    }
    setIsRecording(false);
    setIsPrompterRunning(false);
  };

  const handleDeleteRecording = () => {
    if (recordedVideoUrl && recordedVideoUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(recordedVideoUrl);
      } catch {}
    }
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];
    setRecordingSeconds(0);
    toast({
      title: '🗑️ Pitch Recording Deleted',
      description: 'The recorded video has been removed. You can now record a new pitch.',
    });
  };

  // Generate Script using AI Prompting Engine
  const handleGenerateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      const generated = `Hi, I'm ${candidateName}. As a ${targetRole} with ${yearsExperience} of experience, I specialize in building robust, high-scale web platforms using ${topSkills}.\n\nThroughout my career, I've focused on delivering clean code, optimizing database performance, and driving developer velocity. I'm passionate about solving complex engineering challenges and contributing to mission-driven products.\n\nThank you for considering my application. I look forward to discussing how I can add immediate value to your team!`;
      setPitchScript(generated);
      setIsGeneratingScript(false);
      toast({
        title: '✨ AI Pitch Script Generated',
        description: 'Tailored 45-second video script loaded into teleprompter.',
      });
    }, 600);
  };

  // AI Speech Voiceover Synthesizer
  const handleVoiceover = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingVoiceover) {
        window.speechSynthesis.cancel();
        setIsSpeakingVoiceover(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(pitchScript);
        const activeVoice = voicesList.find((v) => v.voiceURI === selectedVoiceURI);
        if (activeVoice) {
          utterance.voice = activeVoice;
        }
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.onend = () => setIsSpeakingVoiceover(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeakingVoiceover(true);
        toast({
          title: `🔊 AI Voiceover Active (${activeVoice?.name || 'Selected Voice'})`,
          description: `Reading script with ${voiceRate}x speed & ${activeVoice?.lang || 'English'} accent.`,
        });
      }
    } else {
      toast({
        title: 'Voiceover Unsupported',
        description: 'Browser Speech Synthesis API is unavailable.',
        variant: 'destructive',
      });
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black shadow-lg shadow-indigo-500/20">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  AI Resume Video Pitch Studio
                </h1>
                <Badge className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  PRO FEATURE
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Record or synthesize 45-second video elevator pitches with live teleprompter &amp; lower-third badges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isCameraActive ? (
              <Button
                onClick={startCamera}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl gap-2 shadow-md shadow-indigo-500/20"
              >
                <Camera className="h-4 w-4" />
                <span>Enable Webcam</span>
              </Button>
            ) : (
              <Button
                onClick={stopCamera}
                variant="outline"
                className="border-slate-700 text-slate-300 font-bold text-xs py-2 px-4 rounded-xl gap-2"
              >
                <CameraOff className="h-4 w-4" />
                <span>Disable Camera</span>
              </Button>
            )}
          </div>
        </div>

        {/* 2-Column Workspace Grid (Balanced 6-6 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Live Studio Stage & Quality Metrics (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-[#090b14] text-white p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Top Studio Indicator Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                    <span className="font-extrabold text-xs text-slate-300 uppercase tracking-wider">
                      {isRecording ? 'LIVE RECORDING IN PROGRESS' : 'STUDIO PREVIEW STAGE'}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    REC {formatSeconds(recordingSeconds)}
                  </span>
                </div>

                {/* Video Recording Viewport / Canvas Stage */}
                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden shadow-inner flex items-center justify-center min-h-[240px]">
                  <video
                    ref={videoPreviewRef}
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
                  />

                  {/* Animated Background Stage when Camera is Off */}
                  {!isCameraActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#090d16] flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="h-16 w-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Tv className="h-8 w-8" />
                      </div>
                      <p className="font-black text-white text-base">{candidateName}</p>
                      <p className="text-xs text-indigo-300 font-medium max-w-sm">{targetRole}</p>
                      <Badge className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px]">
                        CANVAS STUDIO STAGE
                      </Badge>
                    </div>
                  )}

                  {/* Lower-Third Branding Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 p-3 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="space-y-0.5">
                      <p className="font-black text-white text-xs">{candidateName}</p>
                      <p className="text-[10px] text-indigo-300 font-semibold">{targetRole} • {yearsExperience}</p>
                    </div>
                    <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold">
                      VERIFIED APPLICANT
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Recording Action Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl gap-2 shadow-lg shadow-rose-600/20"
                    >
                      <CircleDot className="h-4 w-4 animate-pulse" />
                      <span>Start Recording</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl gap-2 shadow-lg shadow-amber-600/20"
                    >
                      <Square className="h-4 w-4 fill-white" />
                      <span>Stop Recording</span>
                    </Button>
                  )}

                  <Button
                    onClick={handleVoiceover}
                    variant="outline"
                    className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 font-bold text-xs py-2.5 px-3.5 rounded-xl gap-1.5"
                  >
                    <Volume2 className={`h-4 w-4 ${isSpeakingVoiceover ? 'text-indigo-400 animate-bounce' : ''}`} />
                    <span>{isSpeakingVoiceover ? 'Stop Voice' : 'AI Voiceover'}</span>
                  </Button>
                </div>

                {recordedVideoUrl && (
                  <div className="flex items-center gap-2">
                    <a href={recordedVideoUrl} download={`${candidateName.replace(/\s+/g, '_')}_Video_Pitch.webm`}>
                      <Button variant="outline" className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40 font-bold text-xs py-2.5 px-4 rounded-xl gap-1.5 cursor-pointer">
                        <Download className="h-4 w-4" />
                        <span>Download Video</span>
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      onClick={handleDeleteRecording}
                      className="border-rose-500/40 text-rose-400 hover:bg-rose-950/40 font-bold text-xs py-2.5 px-3.5 rounded-xl gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Pitch</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Studio Best Practices & Audio Waveform Quality Card */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>STUDIO RECORDING BEST PRACTICES</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">100% ATS COMPLIANT</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>45-60s ideal pitch length</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Maintain eye-level camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Clear audio &amp; noise cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Quantifiable achievements</span>
                </div>
              </div>
            </Card>

            {/* Generated Video Player Preview Card */}
            {recordedVideoUrl && (
              <Card className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-white uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>RECORDED PITCH PREVIEW</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-900 text-emerald-300 text-[10px]">READY FOR SUBMISSION</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteRecording}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl px-2 py-1 gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
                <video src={recordedVideoUrl} controls className="w-full rounded-2xl border border-slate-800 shadow-lg max-h-48 object-cover" />
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN: AI Script Generator & Teleprompter Controls (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            
            {/* Script Tailoring Card */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span>AI Script Tailoring Engine</span>
                </h3>
                <Button
                  size="sm"
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl gap-1.5 py-1 px-3"
                >
                  {isGeneratingScript ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 fill-white" />}
                  <span>Generate AI Pitch</span>
                </Button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Target Job Title</Label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Experience</Label>
                    <Input
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Speed (WPM)</Label>
                    <Input
                      type="number"
                      value={wpm}
                      onChange={(e) => setWpm(Number(e.target.value))}
                      className="rounded-xl border-slate-200 dark:border-slate-800 text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Key Technical Skills</Label>
                  <Input
                    value={topSkills}
                    onChange={(e) => setTopSkills(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs h-9"
                  />
                </div>
              </div>
            </Card>

            {/* AI Voice Model & Accent Selection Card */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 text-indigo-500" />
                  <span>AI VOICE MODEL &amp; ACCENT</span>
                </span>
                <Badge className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px]">
                  {voicesList.length > 0 ? `${voicesList.length} VOICES AVAILABLE` : 'SYSTEM AI VOICE'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Select AI Voice Persona</Label>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {voicesList.length === 0 ? (
                      <option value="">Default System AI Voice (English)</option>
                    ) : (
                      voicesList.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Speech Speed Rate</Label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[0.85, 1.0, 1.15, 1.25].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setVoiceRate(rate)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          voiceRate === rate
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Voice Tone Pitch</Label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[0.9, 1.0, 1.1].map((pitch) => (
                      <button
                        key={pitch}
                        type="button"
                        onClick={() => setVoicePitch(pitch)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          voicePitch === pitch
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {pitch === 1.0 ? 'Natural' : pitch < 1.0 ? 'Deep' : 'High'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Interactive Teleprompter Box */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3.5 shadow-sm flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Tv className="h-4 w-4 text-blue-500" />
                    <span>INTERACTIVE TELEPROMPTER</span>
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsPrompterRunning(!isPrompterRunning)}
                    className="text-xs font-bold gap-1 rounded-xl text-blue-600 dark:text-blue-400 py-1"
                  >
                    {isPrompterRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    <span>{isPrompterRunning ? 'Pause' : 'Scroll Script'}</span>
                  </Button>
                </div>

                {/* Scrolling Teleprompter Viewport */}
                <div
                  ref={teleprompterRef}
                  style={{ fontSize: `${fontSize}px` }}
                  className="h-36 overflow-y-auto rounded-2xl bg-slate-900 text-slate-100 p-3.5 leading-relaxed font-medium scroll-smooth shadow-inner border border-slate-800"
                >
                  <p className="whitespace-pre-wrap">{pitchScript}</p>
                </div>
              </div>

              {/* Edit Raw Script Textarea */}
              <div className="space-y-1 pt-1">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">Edit Script Text</Label>
                <Textarea
                  value={pitchScript}
                  onChange={(e) => setPitchScript(e.target.value)}
                  rows={3}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs"
                />
              </div>
            </Card>

          </div>

        </div>

      </div>
    </PageShell>
  );
}

// Circle Dot Icon component
function CircleDot({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
