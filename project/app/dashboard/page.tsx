'use client';

import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  FileText,
  Target,
  Briefcase,
  Sparkles,
  MessageSquare,
  KanbanSquare,
  User as UserIcon,
  Bot,
  Compass,
  Mail,
  Crown,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';

const cards = [
  {
    href: '/auto-apply',
    title: 'Auto-Apply Engine',
    desc: 'Automate job submissions with smart filter rules and daily caps.',
    icon: Bot,
    cta: 'Manage Auto-Apply',
    badge: 'AUTOMATED',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    href: '/resume',
    title: 'Resume & ATS Score',
    desc: 'Upload your resume and get instant ATS scores with keyword feedback.',
    icon: Target,
    cta: 'Analyze resume',
    badge: 'AI PARSER',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    href: '/jobs',
    title: 'Job Search & Sources',
    desc: 'Explore matching openings across LinkedIn, Naukri, Indeed, and Wellfound.',
    icon: Briefcase,
    cta: 'Browse jobs',
    color: 'bg-violet-500/10 text-violet-600',
  },
  {
    href: '/applications',
    title: 'Application Tracker',
    desc: 'Pipeline view across Applied, Assessment, Interview, and Offer stages.',
    icon: KanbanSquare,
    cta: 'View tracker',
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    href: '/cover-letter',
    title: 'Cover Letter Generator',
    desc: 'Generate tailored AI cover letters in Startup, Professional, or Corporate tone.',
    icon: Sparkles,
    cta: 'Generate letter',
    color: 'bg-rose-500/10 text-rose-600',
  },
  {
    href: '/interview-prep',
    title: 'Interview Prep',
    desc: 'Role-targeted Technical, Coding, Behavioral, and HR interview questions.',
    icon: MessageSquare,
    cta: 'Get questions',
    color: 'bg-cyan-500/10 text-cyan-600',
  },
  {
    href: '/career-coach',
    title: 'AI Career Coach',
    desc: 'Skill gap identification, curated learning roadmaps, and salary target predictions.',
    icon: Compass,
    cta: 'Launch coach',
    badge: 'NEW',
    color: 'bg-indigo-500/10 text-indigo-600',
  },
  {
    href: '/email-sync',
    title: 'Email Inbox AI',
    desc: 'Connect Gmail to automatically extract interview invites and offer letters.',
    icon: Mail,
    cta: 'View inbox feed',
    badge: 'SYNCED',
    color: 'bg-teal-500/10 text-teal-600',
  },
];

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, <span className="capitalize">{firstName}</span> 👋
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Here is your live AI application performance dashboard and career control center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auto-apply">
            <Button className="gap-2 shadow-md">
              <Zap className="h-4 w-4 text-amber-400" /> Auto-Apply Active
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="gap-1.5">
              <Crown className="h-4 w-4 text-amber-500" /> Pro Tier
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions This Month</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14 auto-submitted this week
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Ratio</CardTitle>
            <Activity className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">18.5%</div>
            <p className="mt-1 text-xs text-muted-foreground">9 active interview invitations</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Conversion Ratio</CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">6.2%</div>
            <p className="mt-1 text-xs text-muted-foreground">3 job offers received</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ATS Score</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">84 / 100</div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">Top 10% ATS formatting rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">AI Suite & Automation Tools</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className="group relative flex flex-col justify-between overflow-hidden transition-all animate-fade-in-up hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                style={{ animationDelay: `${(i + 1) * 50}ms` }}
              >
                <div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {card.badge && (
                      <Badge variant="outline" className="text-[10px] font-semibold tracking-wide">
                        {card.badge}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                  </CardContent>
                </div>
                <div className="p-6 pt-0">
                  <Link href={card.href}>
                    <Button
                      variant="ghost"
                      className="mt-2 w-full justify-between px-0 text-xs font-semibold text-primary hover:bg-transparent hover:underline"
                    >
                      {card.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
