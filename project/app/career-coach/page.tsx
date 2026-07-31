'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  RefreshCw,
  Award,
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
        title: '✅ Career Assessment Updated',
        description: `Generated AI career roadmap & skill gap analysis for "${targetRole}".`,
      });
    }, 1000);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Executive Suite Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                AI Career Coach <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">CAREER PATH & SKILL GAP ANALYZER</p>
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

        {/* Target Goal Selector Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Target Career Goal</h3>
                <p className="text-slate-500 dark:text-slate-400 font-normal">The AI analyzes live market trends to align your skills with your target position.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target role title..."
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white w-full sm:w-72"
              />
              <Button
                onClick={handleAnalyzeCareer}
                disabled={loading}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 px-5 shrink-0 py-5"
              >
                {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                <span>Analyze Role</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Top 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">TARGET SALARY FLOOR</span>
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{data.salaryInsight.median}</div>
            <p className="text-[11px] font-bold text-slate-400">Range: {data.salaryInsight.min} - {data.salaryInsight.max}</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">SKILL READINESS SCORE</span>
              <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">82% Ready</div>
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">4 key skill gaps identified</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">PROMOTION TIMELINE</span>
              <TrendingUp className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">6 - 12 Months</div>
            <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">Estimated Senior Step</p>
          </Card>
        </div>

        {/* 2-Column Missing Skills & Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {/* Missing Skill Gaps */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-amber-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Missing Skill Gaps</span>
              </h3>
              <p className="text-slate-400 font-normal">High-demand technologies requested in target job descriptions</p>
            </div>

            <div className="space-y-3">
              {data.missingSkills.map((item) => (
                <div key={item.skill} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-900 dark:text-white text-xs">{item.skill}</p>
                      <Badge className={item.demandLevel === 'Critical' ? 'bg-rose-500 text-white font-bold text-[9px]' : 'bg-amber-500 text-white font-bold text-[9px]'}>
                        {item.demandLevel} Demand
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">Recommended: {item.courseRecommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Curated Courses */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-purple-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Curated Learning Roadmaps</span>
              </h3>
              <p className="text-slate-400 font-normal">Handpicked courses to bridge identified technical gaps</p>
            </div>

            <div className="space-y-3">
              {data.recommendedCourses.map((course) => (
                <div key={course.title} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs">{course.title}</p>
                    <p className="text-[10px] text-slate-400">{course.provider} • {course.duration}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1 text-indigo-600 dark:text-indigo-400 font-bold" asChild>
                    <a href={course.url} target="_blank" rel="noreferrer">
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Career Progression Milestones */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 font-mono">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Milestone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Career Path Milestones</span>
            </h3>
            <p className="text-slate-400 font-normal">Step-by-step career growth roadmap to reach Lead/Principal level</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.careerMilestones.map((m) => (
              <div key={m.step} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {m.step}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold">{m.timeline}</Badge>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{m.title}</h4>
                <p className="text-[10px] text-slate-400">Focus: {m.focus}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actionable Resume Suggestions */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300 font-mono">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Actionable Resume & Portfolio Enhancements</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {data.resumeImprovements.map((imp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-normal">{imp}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
