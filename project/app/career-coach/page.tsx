'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Compass,
  TrendingUp,
  BookOpen,
  DollarSign,
  Milestone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CareerCoachResponse } from '@/lib/types';

const INITIAL_COACH_DATA: CareerCoachResponse = {
  missingSkills: [
    { skill: 'System Design & Scalability', demandLevel: 'Critical', courseRecommendation: 'Grokking the System Design Interview' },
    { skill: 'Docker & Containerization', demandLevel: 'High', courseRecommendation: 'Docker & Kubernetes: The Practical Guide' },
    { skill: 'CI/CD Pipeline Automation', demandLevel: 'High', courseRecommendation: 'GitHub Actions & DevOps Essentials' },
    { skill: 'GraphQL APIs', demandLevel: 'Medium', courseRecommendation: 'Fullstack GraphQL with React & Node' },
  ],
  recommendedCourses: [
    { title: 'System Design & Distributed Architecture', provider: 'Educative.io', duration: '12 hours', url: 'https://educative.io' },
    { title: 'Production Docker & Kubernetes for Engineers', provider: 'Udemy', duration: '18 hours', url: 'https://udemy.com' },
    { title: 'Advanced Next.js App Router Masterclass', provider: 'Frontend Masters', duration: '8 hours', url: 'https://frontendmasters.com' },
  ],
  salaryInsight: {
    min: '$115,000',
    median: '$135,000',
    max: '$160,000',
    currency: 'USD / 24-32 LPA',
  },
  careerMilestones: [
    { step: 1, title: 'Current: Full Stack Developer', timeline: 'Present', focus: 'MERN Stack, Next.js, React, Node.js' },
    { step: 2, title: 'Senior Software Engineer', timeline: '6-12 Months', focus: 'System Design, Microservices, Cloud Architecture' },
    { step: 3, title: 'Lead Engineer / Tech Lead', timeline: '2-3 Years', focus: 'Engineering Leadership, Strategy, Distributed Systems' },
  ],
  resumeImprovements: [
    'Add quantifiable performance numbers to project bullet points (e.g., "reduced page latency by 35%").',
    'Include direct links to live demo deployments and active GitHub repositories.',
    'Highlight experience with vector databases (RAG / Gemini AI) in the top technical summary.',
  ],
};

export default function CareerCoachPage() {
  const { toast } = useToast();
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CareerCoachResponse>(INITIAL_COACH_DATA);

  const handleAnalyzeCareer = () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Career Assessment Updated',
        description: `Generated AI career roadmap & skill gap analysis for "${targetRole}".`,
      });
    }, 1200);
  };

  return (
    <PageShell
      title="AI Career Coach & Skill Gap Analyzer"
      subtitle="Personalized career pathing, skill gap identification, salary benchmarking, and learning roadmaps."
    >
      <div className="space-y-6">
        {/* Role Selector Card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-primary/20">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Target Career Goal</h3>
                <p className="text-xs text-muted-foreground">
                  The AI analyzes job market trends to align your skills with your target position.
                </p>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target role title..."
                className="w-full sm:w-72 bg-background"
              />
              <Button onClick={handleAnalyzeCareer} disabled={loading} className="gap-2 shrink-0">
                {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                Analyze Role
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Metric & Salary Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Target Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{data.salaryInsight.median}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Range: {data.salaryInsight.min} - {data.salaryInsight.max} ({data.salaryInsight.currency})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skill Readiness Score</CardTitle>
              <Compass className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">82% Ready</div>
              <p className="mt-1 text-xs text-muted-foreground">4 key skill gaps identified for promotion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promotion Timeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-600">6 - 12 Months</div>
              <p className="mt-1 text-xs text-muted-foreground">Estimated milestone step to Senior role</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Missing Skills & Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-amber-500" /> Missing Skill Gaps
              </CardTitle>
              <CardDescription>High-demand technologies requested in target job descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.missingSkills.map((item) => (
                <div key={item.skill} className="flex flex-col gap-2 rounded-xl border border-border p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{item.skill}</p>
                      <Badge
                        variant={item.demandLevel === 'Critical' ? 'destructive' : 'secondary'}
                        className="text-[10px]"
                      >
                        {item.demandLevel} Demand
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: {item.courseRecommendation}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Curated Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" /> Curated Learning Roadmaps
              </CardTitle>
              <CardDescription>Handpicked courses to bridge identified technical gaps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recommendedCourses.map((course) => (
                <div key={course.title} className="flex items-center justify-between rounded-xl border border-border p-3.5">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.provider} • <span className="text-foreground">{course.duration}</span>
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1 text-primary" asChild>
                    <a href={course.url} target="_blank" rel="noreferrer">
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Career Progression Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Milestone className="h-5 w-5 text-primary" /> Career Path Milestones
            </CardTitle>
            <CardDescription>Step-by-step career growth roadmap to reach Lead/Principal level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.careerMilestones.map((m) => (
                <div key={m.step} className="relative rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {m.step}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{m.timeline}</Badge>
                  </div>
                  <h4 className="mt-3 font-semibold text-sm">{m.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Focus: {m.focus}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume & Portfolio Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Actionable Resume & Portfolio Enhancements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.resumeImprovements.map((imp, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{imp}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
