'use client';

import { useCallback, useRef, useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Upload,
  FileText,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
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

export default function ResumePage() {
  const { toast } = useToast();
  const uploadResume = useUploadResume();
  const atsScore = useAtsScore();
  const resumeAnalysis = useResumeAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: 'PDF only',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }
    setFile(f);
    setResumeText('');
  }, [toast]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      const uploadRes = await uploadResume.mutateAsync(file);
      const text = uploadRes.extractedText || '';
      setResumeText(text);
      const jd = jobDescription.trim() || undefined;
      await Promise.all([
        atsScore.mutateAsync({ resumeText: text, jobDescription: jd }),
        resumeAnalysis.mutateAsync({ resumeText: text }),
      ]);
    } catch (err) {
      toast({
        title: 'Analysis failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const scoreData = atsScore.data;
  const analysisData = resumeAnalysis.data;
  const loading = uploadResume.isPending || atsScore.isPending || resumeAnalysis.isPending;

  return (
    <PageShell
      title="Resume & ATS Score"
      subtitle="Upload your resume to get an ATS score and detailed analysis."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-primary" /> Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
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
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                {file ? file.name : 'Drop your PDF here or click to browse'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">PDF files only</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jd">Job description (optional)</Label>
              <Textarea
                id="jd"
                placeholder="Paste a job description for keyword matching..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleAnalyze}
              disabled={!file || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              {loading ? 'Analyzing…' : 'Analyze Resume'}
            </Button>
          </CardContent>
        </Card>

        {/* Results panel */}
        <div className="space-y-6 lg:col-span-2">
          {loading && !scoreData && (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Uploading and analyzing your resume…
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !scoreData && (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Upload a resume and click Analyze to see your ATS score and analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {scoreData && (
            <AtsScoreCard data={scoreData} />
          )}

          {analysisData && (
            <AnalysisCard data={analysisData} />
          )}
        </div>
      </div>
    </PageShell>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? 'hsl(var(--success))' : score >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
function AtsScoreCard({ data }: { data: AtsScoreResponse }) {
  const breakdown = data?.breakdown ?? {
    keywordMatch: 0,
    formatting: 0,
    completeness: 0,
  };

  const matchedKeywords = data?.matchedKeywords ?? [];
  const missingKeywords = data?.missingKeywords ?? [];

  const breakdownItems = [
    {
      label: 'Keyword Match',
      value: breakdown.keywordMatch,
      icon: Target,
    },
    {
      label: 'Formatting',
      value: breakdown.formatting,
      icon: FileText,
    },
    {
      label: 'Completeness',
      value: breakdown.completeness,
      icon: CheckCircle2,
    },
  ];

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          ATS Score
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ScoreRing score={data?.score ?? 0} />

          <div className="flex-1 space-y-3">
            {breakdownItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>

                    <span>{item.value}%</span>
                  </div>

                  <div className="mt-1 h-2 rounded bg-muted">
                    <div
                      className="h-2 rounded bg-primary transition-all"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">
                Matched Keywords
              </CardTitle>
            </CardHeader>

            <CardContent>
              {matchedKeywords.length === 0 ? (
                <p>No matched keywords.</p>
              ) : (
                matchedKeywords.map((k) => (
                  <span
                    key={k}
                    className="mr-2 inline-block rounded bg-green-100 px-2 py-1 text-sm"
                  >
                    {k}
                  </span>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">
                Missing Keywords
              </CardTitle>
            </CardHeader>

            <CardContent>
              {missingKeywords.length === 0 ? (
                <p>No missing keywords.</p>
              ) : (
                missingKeywords.map((k) => (
                  <span
                    key={k}
                    className="mr-2 inline-block rounded bg-red-100 px-2 py-1 text-sm"
                  >
                    {k}
                  </span>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisCard({ data }: { data: ResumeAnalysisResponse }) {
  const sections = [
    { title: 'Strengths', items: data.strengths, icon: TrendingUp, color: 'text-success', bg: 'bg-success/5', border: 'border-success/30' },
    { title: 'Weaknesses', items: data.weaknesses, icon: TrendingDown, color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/30' },
    { title: 'Suggestions', items: data.suggestions, icon: Lightbulb, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/30' },
    { title: 'Red Flags', items: data.redFlags, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/5', border: 'border-destructive/30' },
  ];

  return (
    <Card className="animate-scale-in animate-delay-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" /> Resume Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white">
            {data.overallScore}
          </div>
          <div>
            <p className="text-sm font-medium">Overall Score</p>
            <p className="text-xs text-muted-foreground">Based on content quality and structure</p>
          </div>
        </div>
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
              <p className={`flex items-center gap-1.5 text-sm font-semibold ${s.color}`}>
                <Icon className="h-4 w-4" /> {s.title}
              </p>
              {s.items.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">No items</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
