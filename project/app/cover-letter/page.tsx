'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Save, Copy, Check, FileText, Trash2 } from 'lucide-react';
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
      toast({ title: 'Cover letter generated' });
    } catch (err) {
      toast({
        title: 'Generation failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
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
      toast({ title: 'Cover letter saved' });
    } catch (err) {
      toast({
        title: 'Could not save',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
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
    } catch (err) {
      toast({
        title: 'Could not delete',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageShell
      title="Cover Letter Generator"
      subtitle="Generate AI cover letters tailored to a job, in your chosen tone."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" /> Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Your resume text</Label>
                <Textarea
                  id="resume"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Select a job (optional)</Label>
                <Select value={selectedJobId} onValueChange={handleJobSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a saved job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific job</SelectItem>
                    {(jobs ?? []).map((j: Job) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.title} — {j.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jd">Job description</Label>
                <Textarea
                  id="jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`rounded-lg border p-3 text-center transition-all ${
                        style === s.value
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleGenerate}
                disabled={generateCoverLetter.isPending || !resumeText.trim() || !jobDescription.trim()}
              >
                {generateCoverLetter.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generateCoverLetter.isPending ? 'Generating…' : 'Generate Cover Letter'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output panel */}
        <div className="space-y-6">
          {generateCoverLetter.data ? (
            <Card className="animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" /> Generated Letter
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy}>
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saveCoverLetter.isPending}>
                      {saveCoverLetter.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-4 text-sm leading-relaxed">
                  {generateCoverLetter.data.coverLetter}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Fill in the form and generate to see your cover letter here.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Saved letters */}
          {(savedLetters ?? []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Cover Letters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(savedLetters ?? []).map((letter: SavedCoverLetter) => (
                  <div
                    key={letter.id}
                    className="group flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {letter.content}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {letter.style && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                            {letter.style}
                          </span>
                        )}
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(letter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
          </div>
    </PageShell>
  );
}
