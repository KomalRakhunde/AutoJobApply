'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  ArrowRight,
  BarChart3,
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  Zap,
  Bot,
  KanbanSquare,
  Star,
  Building2,
  Clock,
  TrendingUp,
  Award,
  Layers,
  Activity,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Automated Auto-Apply Engine',
    desc: 'Submits targeted applications to top job boards automatically according to your role preferences and daily cap.',
    badge: 'AUTOMATION',
    iconColor: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  },
  {
    icon: Target,
    title: 'ATS Resume Audit & Optimization',
    desc: 'Get Jobscan-style ATS breakdown, keyword match score, and instant formatting compatibility fixes.',
    badge: 'AI PARSER',
    iconColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    icon: FileText,
    title: 'Tailored Cover Letter Generator',
    desc: 'Generates custom, job-specific cover letters in Professional, Startup, Executive, or Friendly tones in seconds.',
    badge: 'AI WRITER',
    iconColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  },
  {
    icon: KanbanSquare,
    title: 'Smart Application Pipeline Tracker',
    desc: 'Organize applications seamlessly across Applied, Assessment, Interviewing, and Offer stages.',
    badge: 'WORKFLOW',
    iconColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  {
    icon: Sparkles,
    title: 'Role-Specific Interview Prep',
    desc: 'AI generates company-specific technical questions, model STAR-format answers, and mock practice prompts.',
    badge: 'PREP',
    iconColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  },
  {
    icon: Zap,
    title: 'Gmail Inbox HR Sync',
    desc: 'Automatically parses incoming recruiter emails, technical interview calendar invites, and offer packages.',
    badge: 'SYNC',
    iconColor: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
  },
];

const stats = [
  { value: '48,000+', label: 'Applications Auto-Submitted' },
  { value: '89.4%', label: 'Average ATS Score' },
  { value: '3.4x', label: 'More Interview Invites' },
  { value: '14 Days', label: 'Avg Time to Offer' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Full Stack Engineer',
    company: 'Landed role at Stripe',
    avatar: 'SC',
    content: 'ApplyAI optimized my resume ATS score from 62% to 91%. Within two weeks, I had 4 interview invitations!',
  },
  {
    name: 'Marcus Vance',
    role: 'Frontend Developer',
    company: 'Landed role at Vercel',
    avatar: 'MV',
    content: 'The Auto-Apply engine saved me 15+ hours a week. It submitted 20 quality applications a day matching my tech stack.',
  },
  {
    name: 'Elena Rostova',
    role: 'Product Manager',
    company: 'Landed role at Linear',
    avatar: 'ER',
    content: 'The Cover Letter Generator and Interview Prep tools are incredible. Tailored responses in seconds!',
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload Resume & Set Rules',
    desc: 'Upload your PDF resume and specify your target roles, locations, salary expectations, and daily application limits.',
  },
  {
    number: '02',
    title: 'AI Matches & Auto-Applies',
    desc: 'Our Gemini AI engine parses job descriptions, checks ATS compatibility, and submits optimized applications.',
  },
  {
    number: '03',
    title: 'Track Invites & Land Offers',
    desc: 'View real-time updates in your candidate pipeline dashboard and ace interviews with tailored prep guides.',
  },
];

export default function Home() {
  const router = useRouter();
  const { token } = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Subtle Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[45rem] w-[70rem] rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 pt-safe">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Apply<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {mounted && token ? (
              <Button onClick={() => router.push('/dashboard')} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-xs sm:text-sm">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-xs sm:text-sm" asChild>
                  <Link href="/register">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-20 lg:pb-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-400" />
            <span>AI-Powered Job Application & ATS Automation Platform</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white leading-[1.15]">
            Land Your Next Tech Role <br className="hidden sm:inline" />
            <span className="text-indigo-600 dark:text-indigo-400">3x Faster With AI</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Automate job submissions, score 90%+ on ATS resume checks, generate tailored cover letters, and track every interview invite in one intuitive dashboard.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg font-bold text-sm sm:text-base gap-2" asChild>
              <Link href="/register">
                Start Free Trial <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl font-bold text-sm sm:text-base gap-2" asChild>
              <Link href="/login">
                Sign In to Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant ATS score check</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free forever plan</span>
          </div>
        </div>

        {/* HERO PRODUCT PREVIEW MOCKUP (Light Modern Palette) */}
        <div className="mt-14 mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 relative text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                AI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">ApplyAI Dashboard Preview</p>
                <p className="text-[11px] text-slate-500">Live Application Tracking & Stats</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Auto-Apply Active
            </span>
          </div>

          {/* Metric Cards Mock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Submissions</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">48</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Interview Ratio</span>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">18.5%</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Offers</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">3</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">ATS Score</span>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">84<span className="text-xs text-slate-400">/100</span></p>
            </div>
          </div>
        </div>

        {/* TRUST STATS COUNTER */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid Style) */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold text-xs">
            FEATURES OVERVIEW
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need To Apply Smarter
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            6 powerful AI utilities designed to automate the hardest parts of job hunting.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 transition-all hover:border-indigo-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{f.title}</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-bold text-xs">
            3-STEP PROCESS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ApplyAI Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            From initial setup to landing interview invites in 3 simple steps.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{step.number}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 font-bold text-xs">
            CANDIDATE REVIEWS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved By Job Seekers
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-xs text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-center sm:p-14 shadow-xl">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to Supercharge Your Job Search?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Join thousands of candidates using ApplyAI to automate job applications, pass ATS resume checks, and land top offers.
            </p>
            <div className="pt-2">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 bg-white text-indigo-700 hover:bg-slate-100 rounded-xl font-bold text-sm shadow-md gap-2">
                  Get Started Free <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-[10px]">
              AI
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">ApplyAI Platform</span>
          </div>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Designed & Developed by <span className="font-bold text-indigo-600 dark:text-indigo-400">Komal Rakhunde</span> © 2026
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-indigo-600">Sign In</Link>
            <Link href="/register" className="hover:text-indigo-600">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
