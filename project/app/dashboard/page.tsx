'use client';

import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  FileText,
  Target,
  Briefcase,
  Sparkles,
  MessageSquare,
  KanbanSquare,
  User as UserIcon,
} from 'lucide-react';

const cards = [
  {
    href: '/resume',
    title: 'Resume & ATS Score',
    desc: 'Upload your resume and get an ATS score with keyword feedback.',
    icon: Target,
    enabled: true,
    cta: 'Analyze resume',
  },
  {
    href: '/jobs',
    title: 'Job Search',
    desc: 'Browse and add jobs, then track your applications.',
    icon: Briefcase,
    enabled: true,
    cta: 'Browse jobs',
  },
  {
    href: '/cover-letter',
    title: 'Cover Letter Generator',
    desc: 'Generate AI cover letters in your chosen tone.',
    icon: Sparkles,
    enabled: true,
    cta: 'Generate letter',
  },
  {
    href: '/applications',
    title: 'Application Tracker',
    desc: 'Track applications across a clear status pipeline.',
    icon: KanbanSquare,
    enabled: true,
    cta: 'View tracker',
  },
  {
    href: '/interview-prep',
    title: 'Interview Prep',
    desc: 'Get AI-generated interview questions for any role.',
    icon: MessageSquare,
    enabled: true,
    cta: 'Get questions',
  },
  {
    href: '/profile',
    title: 'Your Profile',
    desc: 'Manage personal details, links, and preferences.',
    icon: UserIcon,
    enabled: true,
    cta: 'Edit profile',
  },
];

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, <span className="capitalize">{firstName}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your job application tools.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="group relative overflow-hidden transition-all animate-fade-in-up hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
                <Link href={card.href}>
                  <Button
                    variant="ghost"
                    className="mt-4 gap-1 px-0 text-primary hover:bg-transparent hover:underline"
                  >
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
