'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  MessageSquare,
  Code2,
  Users,
  HeartHandshake,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useInterviewQuestions } from '@/lib/hooks/use-features';
import type { InterviewQuestionsResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function InterviewPrepPage() {
  const { toast } = useToast();
  const generate = useInterviewQuestions();

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      toast({ title: 'Job title required', variant: 'destructive' });
      return;
    }
    try {
      await generate.mutateAsync({
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim() || undefined,
      });
    } catch (err) {
      toast({
        title: 'Generation failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageShell
      title="Interview Preparation"
      subtitle="Get AI-generated interview questions tailored to any role."
    >
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
          {generate.isPending && !generate.data && (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">Generating questions…</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!generate.isPending && !generate.data && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Enter a job title and generate to see interview questions.
                </p>
              </CardContent>
            </Card>
          )}

          {generate.data && <QuestionSections data={generate.data} />}
        </div>
      </div>
    </PageShell>
  );
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
        const items = data[section.key];
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
