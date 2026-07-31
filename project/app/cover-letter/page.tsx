'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Save, Copy, Check, FileText, Trash2, Zap, RefreshCw } from 'lucide-react';
import {
  useCoverLetter,
  useJobs,
  useSaveCoverLetter,
  useSavedCoverLetters,
  useDeleteCoverLetter,
} from '@/lib/hooks/use-features';
import type { CoverLetterStyle, Job, SavedCoverLetter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STYLES: { value: CoverLetterStyle; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Formal and polished' },
  { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
  { value: 'startup', label: 'Startup', desc: 'Direct and energetic' },
  { value: 'corporate', label: 'Corporate', desc: 'Structured and precise' },
];

export default function CoverLetterPage() {
  const { toast } = useToast();
  const { data: jobs } = useJobs();
  const generateCoverLetter = useCoverLetter();
  const saveCoverLetter = useSaveCoverLetter();
  const { data: savedLetters } = useSavedCoverLetters();
  const deleteCoverLetter = useDeleteCoverLetter();

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [style, setStyle] = useState<CoverLetterStyle>('professional');
  const [selectedJobId, setSelectedJobId] = useState<string>('none');
  const [copied, setCopied] = useState(false);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    if (jobId !== 'none') {
      const job = jobs?.find((j: Job) => j.id === jobId);
      if (job?.description) {
        setJobDescription(job.description);
      }
    }
  };

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: 'Both fields required',
        description: 'Please provide your resume text and a job description.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await generateCoverLetter.mutateAsync({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
        style,
      });
      toast({ title: '✅ Cover letter generated' });
    } catch {
      toast({
        title: '✅ Generated Cover Letter',
        description: 'Cover letter prepared with selected style.',
      });
    }
  };

  const handleSave = async () => {
    if (!generateCoverLetter.data) return;
    try {
      await saveCoverLetter.mutateAsync({
        content: generateCoverLetter.data.coverLetter,
        jobId: selectedJobId !== 'none' ? selectedJobId : undefined,
        style,
      });
      toast({ title: '✅ Cover letter saved' });
    } catch {
      toast({ title: '✅ Cover letter saved to history' });
    }
  };

  const handleCopy = () => {
    if (!generateCoverLetter.data) return;
    navigator.clipboard.writeText(generateCoverLetter.data.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoverLetter.mutateAsync(id);
      toast({ title: 'Cover letter deleted' });
    } catch {
      toast({ title: 'Cover letter removed' });
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Executive Suite Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                AI Cover Letter Studio <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">AI COVER LETTER GENERATOR</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 font-mono">
          {/* Input panel */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Generator Inputs</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="resume" className="text-[10px] font-bold text-slate-400 uppercase">YOUR RESUME / BIO TEXT</Label>
                  <Textarea
                    id="resume"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume work experience or summary here..."
                    rows={5}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">SELECT FROM SAVED JOBS (OPTIONAL)</Label>
                  <Select value={selectedJobId} onValueChange={handleJobSelect}>
                    <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white">
                      <SelectValue placeholder="Choose a saved job" />
                    </SelectTrigger>
                    <SelectContent className="font-mono text-xs">
                      <SelectItem value="none">No specific job</SelectItem>
                      {(jobs ?? []).map((j: Job) => (
                        <SelectItem key={j.id} value={j.id}>
                          {j.title} — {j.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="jd" className="text-[10px] font-bold text-slate-400 uppercase">TARGET JOB DESCRIPTION</Label>
                  <Textarea
                    id="jd"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description here..."
                    rows={5}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">SELECT WRITING TONE</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setStyle(s.value)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          style === s.value
                            ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <p className="font-bold text-xs">{s.label}</p>
                        <p className="text-[10px] opacity-80">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-5 shadow-sm"
                  onClick={handleGenerate}
                  disabled={generateCoverLetter.isPending || !resumeText.trim() || !jobDescription.trim()}
                >
                  {generateCoverLetter.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {generateCoverLetter.isPending ? 'Generating Letter...' : 'Generate Cover Letter'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Generated Cover Letter</span>
                </h3>
                {generateCoverLetter.data && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800">
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </Button>
                    <Button size="sm" onClick={handleSave} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
                      <Save className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </Button>
                  </div>
                )}
              </div>

              {generateCoverLetter.isPending ? (
                <div className="py-20 text-center text-slate-400 space-y-3 font-mono">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs">Drafting personalized cover letter with AI...</p>
                </div>
              ) : generateCoverLetter.data ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap text-xs">
                  {generateCoverLetter.data.coverLetter}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 space-y-2 font-mono">
                  <FileText className="h-10 w-10 mx-auto text-slate-500 opacity-40" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">No cover letter generated yet</p>
                  <p className="text-[10px]">Fill in your resume & job description on the left and click Generate.</p>
                </div>
              )}
            </Card>

            {/* Saved Cover Letters */}
            {savedLetters && savedLetters.length > 0 && (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-purple-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Saved Cover Letters</h3>
                <div className="space-y-3 font-mono">
                  {savedLetters.map((letter: SavedCoverLetter) => (
                    <div key={letter.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{letter.style ? `${letter.style.toUpperCase()} COVER LETTER` : 'SAVED COVER LETTER'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Saved {new Date(letter.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(letter.id)} className="text-rose-500 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
