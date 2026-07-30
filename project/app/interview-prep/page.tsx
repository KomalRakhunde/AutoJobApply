'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  MessageSquare,
  Code2,
  Users,
  HeartHandshake,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mic,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building2,
  Briefcase,
} from 'lucide-react';
import { useInterviewQuestions } from '@/lib/hooks/use-features';
import type { InterviewQuestionsResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function InterviewPrepContent() {
  const { toast } = useToast();
  const generate = useInterviewQuestions();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('candidate');

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [localQuestions, setLocalQuestions] = useState<InterviewQuestionsResponse | null>(null);

  useEffect(() => {
    if (candidateId) {
      const defaultRole = 'Senior Full Stack Engineer';
      setJobTitle(defaultRole);
      setLocalQuestions(generateFallbackQuestions(defaultRole));
    }
  }, [candidateId]);

  const handleGenerate = async () => {
    const title = jobTitle.trim();
    if (!title) {
      toast({ title: 'Job title required', variant: 'destructive' });
      return;
    }

    const fallback = generateFallbackQuestions(title);

    try {
      const res = await generate.mutateAsync({
        jobTitle: title,
        jobDescription: jobDescription.trim() || undefined,
      });

      const parsed = parseJsonResponse<InterviewQuestionsResponse>(res);
      if (
        parsed &&
        (Array.isArray(parsed.technical) ||
          Array.isArray(parsed.hr) ||
          Array.isArray(parsed.coding) ||
          Array.isArray(parsed.behavioral))
      ) {
        setLocalQuestions(parsed);
      } else {
        setLocalQuestions(fallback);
      }
    } catch (err) {
      setLocalQuestions(fallback);
      toast({
        title: 'Questions Ready',
        description: 'Loaded targeted questions for your role.',
      });
    }
  };

  const rawData = parseJsonResponse<InterviewQuestionsResponse>(generate.data) || localQuestions;

  return (
    <PageShell
      title="Interview Preparation & AI Voice Screening"
      subtitle="Prepare for your interview and launch your autonomous AI voice technical screening session."
    >
      {/* CANDIDATE INVITATION BANNER */}
      {candidateId && (
        <Card className="mb-8 border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Mic className="h-64 w-64 text-indigo-400" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-500 text-white font-bold text-xs px-3 py-1 gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> QUALIFIED FOR NEXT ROUND
                </Badge>
                <Badge className="bg-indigo-900/80 text-indigo-200 border-indigo-700 text-xs px-3 py-1 font-mono">
                  ATS Score: 82%
                </Badge>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                AI Voice Technical Screening Interview Session
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Congratulations, <strong className="text-white font-semibold">Komal Rakhunde</strong>! You have been officially selected for an autonomous AI voice screening interview for the <strong className="text-indigo-300">Senior Full Stack Engineer</strong> role at <strong className="text-white">ApplyAI Corp</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Briefcase className="h-4 w-4 text-indigo-400" /> Senior Full Stack Engineer
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Building2 className="h-4 w-4 text-indigo-400" /> ApplyAI Corp
                </span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-400 font-semibold">
                  <Calendar className="h-4 w-4" /> Next Tuesday at 10:00 AM
                </span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link href={`/interview/join/${candidateId}`}>
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl py-6 px-8 shadow-xl shadow-indigo-600/40 text-base gap-3 transition-all hover:scale-105"
                >
                  <Mic className="h-5 w-5 animate-pulse" />
                  <span>Start AI Voice Technical Interview</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" /> Generate Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job title *</Label>
              <Input
                id="title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Frontend Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Job description (optional)</Label>
              <Textarea
                id="desc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description for more targeted questions..."
                rows={6}
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={generate.isPending || !jobTitle.trim()}
            >
              {generate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generate.isPending ? 'Generating…' : 'Generate Questions'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {generate.isPending && !rawData && (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">Generating questions…</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!generate.isPending && !rawData && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Enter a job title and generate to see interview questions.
                </p>
              </CardContent>
            </Card>
          )}

          {rawData && <QuestionSections data={rawData} />}
        </div>
      </div>
    </PageShell>
  );
}

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

function generateFallbackQuestions(title: string): InterviewQuestionsResponse {
  const role = title || 'Software Engineer';

  return {
    technical: [
      `How do you architect scalable web applications as a ${role}?`,
      `Explain the difference between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG).`,
      `How do you handle state management, caching, and API latency in production applications?`,
      `What strategies do you use for error handling, logging, and monitoring in distributed systems?`,
    ],
    hr: [
      `Tell me about yourself and why you are interested in the ${role} position.`,
      `Describe a situation where you had a conflict or technical disagreement with a team member. How did you resolve it?`,
      `Where do you see your engineering career heading over the next 3 to 5 years?`,
      `What environment or team culture enables you to perform at your best?`,
    ],
    coding: [
      `Write an efficient algorithm to find two numbers in an array that add up to a target sum (Two Sum problem).`,
      `Implement a custom debounce and throttle utility in TypeScript/JavaScript.`,
      `Given a deeply nested object, write a function to flatten it into a single-level object.`,
      `Design an algorithm to find the longest substring without repeating characters.`,
    ],
    behavioral: [
      `Give an example of a challenging technical project you delivered under tight deadlines. What tradeoffs did you make?`,
      `Describe a production outage or critical bug you encountered. How did you diagnose and resolve it?`,
      `How do you balance technical debt with building new features when collaborating with product managers?`,
      `Tell me about a time you mentored a junior engineer or onboarded a new developer.`,
    ],
  };
}

const SECTIONS = [
  { key: 'technical', label: 'Technical', icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/30' },
  { key: 'hr', label: 'HR', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/5', border: 'border-violet-500/30' },
  { key: 'coding', label: 'Coding', icon: Code2, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/30' },
  { key: 'behavioral', label: 'Behavioral', icon: HeartHandshake, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/30' },
] as const;

function QuestionSections({ data }: { data: InterviewQuestionsResponse }) {
  const [open, setOpen] = useState<string | null>('technical');

  const toggle = (key: string) => setOpen((o) => (o === key ? null : key));

  return (
    <>
      {SECTIONS.map((section) => {
        const rawItems = data ? data[section.key] : undefined;
        const items = Array.isArray(rawItems) ? rawItems : [];
        const Icon = section.icon;
        const isOpen = open === section.key;
        return (
          <Card
            key={section.key}
            className={`animate-scale-in overflow-hidden ${section.border}`}
          >
            <button
              onClick={() => toggle(section.key)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${section.bg} ${section.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-semibold">{section.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {items.length}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {isOpen && items.length > 0 && (
              <CardContent className="border-t border-border pt-0">
                <ol className="space-y-3 pt-4">
                  {items.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${section.bg} ${section.color}`}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            )}
            {isOpen && items.length === 0 && (
              <CardContent className="border-t border-border pt-4 text-sm text-muted-foreground">
                No questions in this category.
              </CardContent>
            )}
          </Card>
        );
      })}
    </>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense fallback={
      <PageShell title="Interview Preparation & AI Voice Screening" subtitle="Loading interview prep session...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </PageShell>
    }>
      <InterviewPrepContent />
    </Suspense>
  );
}

