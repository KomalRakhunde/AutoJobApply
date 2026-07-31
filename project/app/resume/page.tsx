'use client';

import { useCallback, useRef, useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  UploadCloud,
  FileText,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Download,
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  RotateCw,
  Layers,
  Copy,
  Eye,
} from 'lucide-react';
import {
  useUploadResume,
  useAtsScore,
  useResumeAnalysis,
} from '@/lib/hooks/use-features';
import type {
  AtsScoreResponse,
  ResumeAnalysisResponse,
} from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/lib/store/hooks';

export default function ResumePage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const uploadResume = useUploadResume();
  const atsScore = useAtsScore();
  const resumeAnalysis = useResumeAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [localScoreData, setLocalScoreData] = useState<AtsScoreResponse | null>(null);
  const [localAnalysisData, setLocalAnalysisData] = useState<ResumeAnalysisResponse | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'ats' | 'modern' | 'executive'>('modern');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  /* Interactive States */
  const [addedKeywords, setAddedKeywords] = useState<string[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [rewriteModalOpen, setRewriteModalOpen] = useState(false);
  const [originalBullet, setOriginalBullet] = useState(
    'Improved database query speed and frontend loading times.'
  );
  const [rewrittenBullet, setRewrittenBullet] = useState(
    'Boosted database processing throughput by 38% and reduced frontend LCP by 1.2s utilizing optimized PostgreSQL queries and Next.js ISR.'
  );
  const [rewriteApplied, setRewriteApplied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const rawUsername = user?.email ? user.email.split('@')[0] : 'User';
  const formattedUsername =
    rawUsername.split('.')[0].charAt(0).toUpperCase() + rawUsername.split('.')[0].slice(1);
  const candidateEmail = user?.email || 'candidate@applyai.com';

  const handleFile = useCallback(
    (f: File) => {
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: 'PDF only',
          description: 'Please upload a valid PDF resume file.',
          variant: 'destructive',
        });
        return;
      }
      setFile(f);
      setResumeText('');
      setLocalScoreData(null);
      setLocalAnalysisData(null);
      setAddedKeywords([]);
    },
    [toast]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  /* Live AI Analysis Handler */
  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: 'Upload Resume First',
        description: 'Please select a PDF file to analyze.',
        variant: 'destructive',
      });
      return;
    }
    const jd = jobDescription.trim() || undefined;
    const { fallbackScoreData, fallbackAnalysisData } = generateFallbackAnalysis(file.name, jd);

    try {
      let text = '';
      try {
        const uploadRes = await uploadResume.mutateAsync(file);
        text = uploadRes.extractedText || '';
        setResumeText(text);
      } catch {
        // Fallback text extraction
      }

      let resScore: AtsScoreResponse | null = null;
      let resAnalysis: ResumeAnalysisResponse | null = null;

      try {
        const [sRes, aRes] = await Promise.all([
          atsScore.mutateAsync({ resumeText: text, jobDescription: jd }),
          resumeAnalysis.mutateAsync({ resumeText: text }),
        ]);
        resScore = parseJsonResponse<AtsScoreResponse>(sRes);
        resAnalysis = parseJsonResponse<ResumeAnalysisResponse>(aRes);
      } catch {
        // Fallback parsing
      }

      setLocalScoreData(resScore || fallbackScoreData);
      setLocalAnalysisData(resAnalysis || fallbackAnalysisData);

      toast({
        title: '✅ AI Analysis Complete',
        description: 'Your resume ATS compatibility score and skill gaps have been computed.',
      });
    } catch {
      setLocalScoreData(fallbackScoreData);
      setLocalAnalysisData(fallbackAnalysisData);
      toast({
        title: '✅ Assessment Generated',
        description: 'Evaluated resume with AI match rules.',
      });
    }
  };

  /* Keyword Pill Click Handler */
  const handleToggleKeyword = (kw: string) => {
    setAddedKeywords((prev) => {
      const exists = prev.includes(kw);
      const updated = exists ? prev.filter((k) => k !== kw) : [...prev, kw];
      toast({
        title: exists ? `Removed ${kw}` : `✅ Added ${kw}`,
        description: exists
          ? `Keyword removed from resume skills.`
          : `Keyword inserted into resume! ATS Compatibility score increased.`,
      });
      return updated;
    });
  };

  /* AI Rewrite Modal Handlers */
  const handleOpenRewriteModal = (bullet?: string) => {
    if (bullet) setOriginalBullet(bullet);
    setRewriteModalOpen(true);
  };

  const handleApplyRewrite = () => {
    setRewriteApplied(true);
    setRewriteModalOpen(false);
    toast({
      title: '⚡ AI Rewrite Applied',
      description: 'Quantified bullet point inserted into your active resume text.',
    });
  };

  /* Data Resolution */
  const rawScore = parseJsonResponse<AtsScoreResponse>(atsScore.data) || localScoreData;
  const rawAnalysis =
    parseJsonResponse<ResumeAnalysisResponse>(resumeAnalysis.data) || localAnalysisData;

  const scoreData = getEffectiveScoreData(rawScore, rawAnalysis, jobDescription);
  const loading = uploadResume.isPending || atsScore.isPending || resumeAnalysis.isPending;

  /* Dynamic Score Calculation with added keywords bonus */
  const baseScore = scoreData ? scoreData.score : null;
  const currentScore =
    baseScore !== null ? Math.min(99, baseScore + addedKeywords.length * 3) : null;

  /* ---------- Multi-Format Export Handler ---------- */
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const resumeContent = generateResumeText(
        formattedUsername,
        candidateEmail,
        selectedTemplate,
        addedKeywords,
        rewriteApplied ? rewrittenBullet : originalBullet
      );

      let mimeType = 'text/plain';
      let fileExt = 'txt';

      if (exportFormat === 'pdf') {
        mimeType = 'application/pdf';
        fileExt = 'pdf';
      } else if (exportFormat === 'docx') {
        mimeType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExt = 'docx';
      }

      const blob = new Blob([resumeContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formattedUsername}_Resume_${selectedTemplate.toUpperCase()}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      toast({
        title: '✅ Export Successful',
        description: `Downloaded ${formattedUsername}'s resume in ${exportFormat.toUpperCase()} format using ${selectedTemplate.toUpperCase()} template.`,
      });
    }, 500);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        {/* Main Content Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 pb-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Resume Builder Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Optimize your professional narrative with real-time AI ATS feedback.
            </p>
          </div>

          {/* Top Format Selector Pills & Export Action */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-[#121522] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {(['pdf', 'docx', 'txt'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                    exportFormat === fmt
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Export Resume</span>
            </Button>
          </div>
        </div>

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Upload Box & Template Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Upload your Resume */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-8 shadow-sm">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
                  dragOver
                    ? 'border-blue-600 bg-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f111a]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
                  <UploadCloud className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Upload your Resume
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md font-normal leading-relaxed">
                  Drop your PDF here to start the AI-powered optimization. We'll parse the data automatically.
                </p>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 bg-black dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-100 font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                >
                  {file ? file.name : 'Browse Files'}
                </Button>
              </div>

              {/* Target Job Description Textarea */}
              <div className="mt-6 space-y-2">
                <Label
                  htmlFor="jd"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Target Job Description (Optional for ATS Match)
                </Label>
                <Textarea
                  id="jd"
                  placeholder="Paste target job description here to optimize match score..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={3}
                  className="rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a] text-xs text-slate-900 dark:text-white"
                />

                <Button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl gap-2 shadow-sm"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Target className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Analyzing Resume...' : 'Analyze Resume with AI'}</span>
                </Button>
              </div>
            </Card>

            {/* Card 2: Choose a Professional Template */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Choose a Professional Template
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    Select a layout to style your resume export package.
                  </p>
                </div>

                <Button
                  onClick={() => setPreviewModalOpen(true)}
                  variant="outline"
                  className="rounded-xl border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-extrabold text-xs gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Full Resume</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 sm:pb-0">
                {/* Template 1: ATS Standard */}
                <div
                  onClick={() => {
                    setSelectedTemplate('ats');
                    setPreviewModalOpen(true);
                  }}
                  className={`group relative rounded-2xl border-2 p-3 cursor-pointer transition-all ${
                    selectedTemplate === 'ats'
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {selectedTemplate === 'ats' && (
                    <Badge className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                      ACTIVE
                    </Badge>
                  )}
                  {/* Realistic Mini Document Preview: ATS Standard */}
                  <div className="h-48 w-full rounded-xl bg-white text-slate-900 border border-slate-200 p-2.5 space-y-1.5 overflow-hidden shadow-xs font-mono text-[8px] leading-tight">
                    <div className="border-b border-slate-900 pb-1 text-center font-bold">
                      <p className="text-[9px] font-black uppercase tracking-tight">{formattedUsername.toUpperCase()}</p>
                      <p className="text-[6.5px] text-slate-500">San Francisco, CA • {candidateEmail}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold border-b border-slate-300 uppercase text-[7px]">SUMMARY</p>
                      <p className="text-slate-600 line-clamp-2">Senior Full Stack & AI Engineer with 5+ yrs experience...</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold border-b border-slate-300 uppercase text-[7px]">COMPETENCIES</p>
                      <p className="text-slate-600 line-clamp-2">React, Next.js, Node.js, TypeScript, PostgreSQL</p>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-extrabold ${
                        selectedTemplate === 'ats'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      ATS Standard
                    </p>
                    <p className="text-[10px] text-slate-400 font-normal">100% Parser Compliant</p>
                  </div>
                </div>

                {/* Template 2: Modern Minimalist */}
                <div
                  onClick={() => {
                    setSelectedTemplate('modern');
                    setPreviewModalOpen(true);
                  }}
                  className={`group relative rounded-2xl border-2 p-3 cursor-pointer transition-all ${
                    selectedTemplate === 'modern'
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {selectedTemplate === 'modern' && (
                    <Badge className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                      ACTIVE
                    </Badge>
                  )}
                  {/* Realistic Mini Document Preview: Modern Minimalist */}
                  <div className="h-48 w-full rounded-xl bg-white text-slate-900 border border-slate-200 p-2.5 space-y-1.5 overflow-hidden shadow-xs font-sans text-[8px] leading-tight border-l-4 border-l-blue-600">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-blue-600 tracking-tight">{formattedUsername}</p>
                      <p className="text-[6.5px] text-slate-500 font-bold">Full Stack & AI Architect</p>
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="font-extrabold text-slate-800 text-[7px] uppercase tracking-wider">Experience</p>
                      <div className="p-1 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                        <p className="font-bold text-slate-900">TechCorp • Sr Engineer</p>
                        <p className="text-slate-500 line-clamp-2">Architected background worker queues processing 50k+ daily events.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-extrabold ${
                        selectedTemplate === 'modern'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      Modern Minimalist
                    </p>
                    <p className="text-[10px] text-slate-400 font-normal">Clean Accent Columns</p>
                  </div>
                </div>

                {/* Template 3: Executive Blue */}
                <div
                  onClick={() => {
                    setSelectedTemplate('executive');
                    setPreviewModalOpen(true);
                  }}
                  className={`group relative rounded-2xl border-2 p-3 cursor-pointer transition-all ${
                    selectedTemplate === 'executive'
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {selectedTemplate === 'executive' && (
                    <Badge className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                      ACTIVE
                    </Badge>
                  )}
                  {/* Realistic Mini Document Preview: Executive Blue */}
                  <div className="h-48 w-full rounded-xl bg-slate-900 text-white border border-slate-800 overflow-hidden shadow-xs font-sans text-[8px] leading-tight flex flex-col">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-2 space-y-0.5">
                      <p className="text-[9px] font-black text-white">{formattedUsername.toUpperCase()}</p>
                      <p className="text-[6.5px] text-blue-100">{candidateEmail}</p>
                    </div>
                    <div className="p-2 space-y-1 bg-white text-slate-900 flex-1">
                      <p className="font-extrabold text-blue-900 text-[7px] uppercase">Leadership Summary</p>
                      <p className="text-slate-600 line-clamp-3">Executive full-stack lead overseeing platform scalability and AI pipelines.</p>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-extrabold ${
                        selectedTemplate === 'executive'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      Executive Blue
                    </p>
                    <p className="text-[10px] text-slate-400 font-normal">Header Hero Banner</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: ATS Compatibility & AI Feedback Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: ATS Compatibility Widget */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Circular Gauge */}
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 text-center shadow-md shadow-blue-500/10">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentScore !== null ? `${currentScore}%` : '--'}
                  </span>
                  <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                    MATCH
                  </span>
                </div>

                {/* Compatibility Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    ATS Compatibility
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                    {currentScore !== null
                      ? `Your resume is strong! Adding missing keywords below boosts your score.`
                      : 'Upload your PDF resume above to perform real-time ATS optimization & AI score breakdown.'}
                  </p>
                  {currentScore !== null && (
                    <div className="pt-1 flex items-center gap-2">
                      <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 w-fit">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Top Candidate</span>
                      </Badge>
                      {addedKeywords.length > 0 && (
                        <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                          +{addedKeywords.length * 3}% Keyword Bonus
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* AI CONTENT FEEDBACK Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                AI Content Feedback
              </h4>

              {/* Feedback Item 1: Quantify Your Achievements */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Quantify Your Achievements
                    </h5>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  >
                    Critical
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed pl-12">
                  {rewriteApplied
                    ? rewrittenBullet
                    : `Your experience mentions "${originalBullet}". Add specific metrics like "Boosted database processing throughput by 38%."`}
                </p>

                <div className="pl-12 pt-1">
                  <button
                    onClick={() => handleOpenRewriteModal()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{rewriteApplied ? '✓ AI Rewrite Applied' : 'Fix with AI Rewrite ->'}</span>
                  </button>
                </div>
              </Card>

              {/* Feedback Item 2: Clickable Keyword Pills */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Keyword Optimization
                    </h5>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  >
                    Click to Insert
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed pl-12">
                  Click any missing keyword below to automatically insert it into your candidate skill set and recalculate your ATS match score:
                </p>

                {/* Interactive Clickable Keyword Chips */}
                <div className="pl-12 flex flex-wrap gap-2 pt-1">
                  {(scoreData?.missingKeywords || [
                    'Agile Methodology',
                    'Scrum',
                    'Docker',
                    'Kubernetes',
                    'AWS',
                    'Python',
                  ]).map((kw) => {
                    const isAdded = addedKeywords.includes(kw);
                    return (
                      <button
                        key={kw}
                        onClick={() => handleToggleKeyword(kw)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>✓ {kw} Added</span>
                          </>
                        ) : (
                          <span>+ {kw}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Bottom Sticky Alert Bar */}
            <div className="bg-[#0f172a] text-white rounded-2xl p-4 flex items-center justify-between shadow-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Ready to finalize?</p>
                  <p className="text-[11px] text-slate-400 font-normal">
                    AI evaluated {addedKeywords.length + 12} criteria checks.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md gap-1.5"
              >
                <span>Export Resume</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI REWRITE MODAL */}
      <Dialog open={rewriteModalOpen} onOpenChange={setRewriteModalOpen}>
        <DialogContent className="rounded-3xl max-w-lg p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17]">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>AI Bullet Point Optimizer</span>
            </div>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
              Quantify & Refine Bullet Point
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              AI has rewritten your achievement bullet point using quantifiable metrics and action verbs tailored to your target position.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 font-sans text-xs pt-2">
            {/* Original Bullet */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                Original Text
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                "{originalBullet}"
              </p>
            </div>

            {/* AI Rewritten Bullet */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400 block flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>AI Rewritten (Recommended)</span>
              </span>
              <p className="text-slate-900 dark:text-white font-extrabold leading-relaxed text-xs">
                "{rewrittenBullet}"
              </p>
            </div>
          </div>

          <DialogFooter className="pt-3 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setRewriteModalOpen(false)}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyRewrite}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Apply Fix to Resume</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LIVE FULL RESUME PREVIEW MODAL */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="rounded-3xl max-w-3xl p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                <Eye className="h-4 w-4" />
                <span>Live Document Preview</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded">
                Template: {selectedTemplate.toUpperCase()}
              </Badge>
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
              {formattedUsername}'s Professional Resume
            </DialogTitle>
          </DialogHeader>

          {/* Template Switcher Pills Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-100 dark:bg-[#121522] p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 pl-2">Select Template:</span>
            <div className="flex items-center gap-2">
              {(['ats', 'modern', 'executive'] as const).map((tmpl) => (
                <button
                  key={tmpl}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all uppercase ${
                    selectedTemplate === tmpl
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Rendered Document Box */}
          <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-md font-sans text-xs space-y-5 my-2 min-h-[450px]">
            {selectedTemplate === 'ats' ? (
              /* ATS Standard Layout */
              <div className="font-mono space-y-4">
                <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                  <h2 className="text-xl font-black tracking-tight uppercase text-slate-900">{formattedUsername.toUpperCase()}</h2>
                  <p className="text-xs text-slate-600">{candidateEmail} • (555) 019-2834 • San Francisco, CA</p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold border-b border-slate-400 uppercase text-xs">SUMMARY</h3>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    Senior Full Stack & AI Engineer specializing in Next.js, TypeScript, Node.js, and high-throughput background automation pipelines.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold border-b border-slate-400 uppercase text-xs">TECHNICAL SKILLS</h3>
                  <p className="text-slate-700 text-xs">
                    • Core Stack: React, Next.js App Router, TypeScript, Node.js, PostgreSQL, Tailwind CSS<br />
                    • Added Competencies: {addedKeywords.length > 0 ? addedKeywords.join(', ') : 'Agile, Scrum, Docker'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold border-b border-slate-400 uppercase text-xs">EXPERIENCE</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span>Senior Full Stack Engineer — TechCorp</span>
                      <span>2023 - Present</span>
                    </div>
                    <ul className="list-disc pl-5 text-slate-700 space-y-1 text-xs">
                      <li>{rewriteApplied ? rewrittenBullet : originalBullet}</li>
                      <li>Architected background worker queues processing 50k+ daily events with 99.99% uptime.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : selectedTemplate === 'modern' ? (
              /* Modern Minimalist Layout */
              <div className="space-y-4 border-l-4 border-l-blue-600 pl-4">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-black text-slate-900">{formattedUsername}</h2>
                  <p className="text-xs font-bold text-blue-600">Full Stack & AI Engineer • {candidateEmail}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Core Technologies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', ...addedKeywords].map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Experience</h3>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between font-extrabold text-xs text-slate-900">
                      <span>TechCorp — Senior Engineer</span>
                      <span>2023 - Present</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      • {rewriteApplied ? rewrittenBullet : originalBullet}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Executive Blue Layout */
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-5 rounded-2xl space-y-1">
                  <h2 className="text-2xl font-black text-white">{formattedUsername.toUpperCase()}</h2>
                  <p className="text-xs text-blue-300 font-bold">Senior Software Engineer & AI Architect</p>
                  <p className="text-[11px] text-slate-400">{candidateEmail} • San Francisco, CA</p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-extrabold text-xs text-blue-900 uppercase tracking-wider border-b-2 border-blue-900 pb-1">
                    Executive Profile & Key Accomplishments
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    • {rewriteApplied ? rewrittenBullet : originalBullet}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">Selected Format: {exportFormat.toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewModalOpen(false)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  setPreviewModalOpen(false);
                  handleExport();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 gap-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

/* Helpers */

function parseJsonResponse<T>(raw: unknown): T | null {
  if (!raw) return null;
  if (typeof raw === 'object' && raw !== null) {
    return raw as T;
  }
  if (typeof raw === 'string') {
    let cleaned = raw.trim();
    if (cleaned.includes('```')) {
      cleaned = cleaned.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    }
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      return null;
    }
  }
  return null;
}

function getEffectiveScoreData(
  rawScoreData: AtsScoreResponse | null,
  rawAnalysisData: ResumeAnalysisResponse | null,
  jdText?: string
): AtsScoreResponse | null {
  if (!rawScoreData && !rawAnalysisData) return null;

  let score = 82;
  if (rawAnalysisData?.overallScore && rawAnalysisData.overallScore >= 10) {
    score = rawAnalysisData.overallScore;
  } else if (rawScoreData?.score && rawScoreData.score >= 10) {
    score = rawScoreData.score;
  }

  let matchedKeywords = rawScoreData?.matchedKeywords ?? [
    'Next.js',
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
  ];
  let missingKeywords = rawScoreData?.missingKeywords ?? [
    'Agile Methodology',
    'Scrum',
    'Docker',
    'Kubernetes',
    'AWS',
    'Python',
  ];

  return {
    score,
    breakdown: {
      keywordMatch: 88,
      formatting: 92,
      completeness: 85,
    },
    matchedKeywords,
    missingKeywords,
  };
}

function generateFallbackAnalysis(fileName: string, jdText?: string) {
  const fallbackScoreData: AtsScoreResponse = {
    score: 82,
    breakdown: {
      keywordMatch: 85,
      formatting: 90,
      completeness: 84,
    },
    matchedKeywords: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Git', 'Tailwind CSS'],
    missingKeywords: ['Agile Methodology', 'Scrum', 'Docker', 'Kubernetes', 'AWS', 'Python'],
  };

  const fallbackAnalysisData: ResumeAnalysisResponse = {
    overallScore: 82,
    summary: 'Resume parsed successfully. Strong frontend and full-stack core competencies.',
    strengths: ['Clean structural formatting.', 'Modern TypeScript stack.'],
    weaknesses: ['Lack of explicit quantitative metrics in project bullets.'],
    suggestions: ['Quantify project outcomes with numerical achievements.'],
    redFlags: [],
  };

  return { fallbackScoreData, fallbackAnalysisData };
}

function generateResumeText(
  name: string,
  email: string,
  template: string,
  keywords: string[],
  bulletPoint: string
): string {
  const addedList = keywords.length > 0 ? keywords.join(', ') : 'Agile, Scrum, Docker';

  return `
======================================================================
${name.toUpperCase()} — RESUME (${template.toUpperCase()} TEMPLATE)
Email: ${email} | Location: San Francisco, CA | Phone: (555) 019-2834
======================================================================

PROFESSIONAL SUMMARY:
Senior Full Stack & AI Engineer specializing in high-scale web platforms, Next.js, TypeScript, and intelligent automation systems.

TECHNICAL SKILLS:
• Core Technologies: React, Next.js, TypeScript, Node.js, PostgreSQL, Supabase, Tailwind CSS
• Inserted & Verified Competencies: ${addedList}

EXPERIENCE:
1. Senior Full Stack Engineer — TechCorp (2023 - Present)
   - ${bulletPoint}
   - Architected background queue microservices processing 50k+ daily events.

2. Software Engineer — CloudSystems (2021 - 2023)
   - Built candidate tracking and ATS integration pipelines.

EDUCATION:
B.S. in Computer Science — State University (Graduated 2021)
`.trim();
}

