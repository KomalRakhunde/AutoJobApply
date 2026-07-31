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
  Menu,
  X,
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

const steps = [
  {
    number: '01',
    title: 'Upload Resume & Preferences',
    desc: 'Upload your PDF resume. Our AI extracts your core skills, experience level, target roles, and salary expectations.',
  },
  {
    number: '02',
    title: 'AI Matches & Auto-Applies',
    desc: 'The automation engine scans LinkedIn, Indeed, and company portals to submit high-match applications on your behalf.',
  },
  {
    number: '03',
    title: 'Track Invites & Land Offers',
    desc: 'View real-time email response analytics, schedule interviews with calendar sync, and accept your dream offer.',
  },
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
    content: 'The tailored cover letter generator created perfectly formatted letters for each company. Highly recommended!',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { token, user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardRedirect = () => {
    const userRole = (user?.role || 'student').toLowerCase();
    const targetPortal = userRole === 'super_admin' ? 'super-admin' : userRole;
    router.push(`/dashboard/${targetPortal}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Subtle Background Pattern & Glow Effect */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[35rem] sm:h-[45rem] w-[90vw] max-w-[70rem] rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 pt-safe">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Apply<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            {mounted && (token || isAuthenticated) ? (
              <Button
                onClick={handleDashboardRedirect}
                className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-xs sm:text-sm px-3.5 sm:px-4 min-h-[44px]"
              >
                <span>Go to Dashboard</span> <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-3 min-h-[44px]"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-xs sm:text-sm px-3.5 sm:px-4 min-h-[44px]"
                  asChild
                >
                  <Link href="/register">
                    <span>Get Started</span> <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden min-h-[44px] min-w-[44px] text-slate-600 dark:text-slate-300 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3 animate-fade-in-down">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] flex items-center"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] flex items-center"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] flex items-center"
              >
                Testimonials
              </a>
            </nav>
            {(!mounted || !token) && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs rounded-xl min-h-[44px]" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button size="sm" className="w-full bg-indigo-600 text-white text-xs rounded-xl min-h-[44px]" asChild>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pt-20 lg:pb-24 text-center">
        <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-400 shrink-0" />
            <span className="truncate">AI-Powered Job Application & ATS Automation Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Land Your Next Tech Role <br className="hidden sm:inline" />
            <span className="text-indigo-600 dark:text-indigo-400">3x Faster With AI</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed px-2 sm:px-0">
            Automate job submissions, score 90%+ on ATS resume checks, generate tailored cover letters, and track every interview invite in one intuitive dashboard.
          </p>

          {/* Responsive Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg font-bold text-sm sm:text-base gap-2 justify-center"
              asChild
            >
              <Link href="/register">
                <span>Start Free Trial</span> <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 rounded-xl font-bold text-sm sm:text-base gap-2 justify-center"
              asChild
            >
              <Link href="/login">
                <span>Sign In to Dashboard</span>
              </Link>
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> Instant ATS score check</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> Free forever plan</span>
          </div>
        </div>

        {/* HERO PRODUCT PREVIEW MOCKUP */}
        <div className="mt-10 sm:mt-14 mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 relative text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shrink-0">
                AI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">ApplyAI Candidate Control Center</p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Live Application Tracking & Analytics</p>
              </div>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Auto-Apply Active
            </span>
          </div>

          {/* Metric Cards Mock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-3.5">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Submissions</span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">48</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Interview Ratio</span>
              <p className="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">18.5%</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Offers</span>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">3</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">ATS Score</span>
              <p className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">84<span className="text-xs text-slate-400">/100</span></p>
            </div>
          </div>
        </div>

        {/* TRUST STATS COUNTER */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <p className="text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.value}</p>
              <p className="text-[10.5px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid Style) */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center space-y-2.5 sm:space-y-3">
          <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold text-[10px] sm:text-xs">
            FEATURES OVERVIEW
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need To Apply Smarter
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-base">
            6 powerful AI utilities designed to automate the hardest parts of job hunting.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 transition-all hover:border-indigo-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${f.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center space-y-2.5 sm:space-y-3">
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-bold text-[10px] sm:text-xs">
            3-STEP PROCESS
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ApplyAI Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-base">
            From initial setup to landing interview invites in 3 simple steps.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2 sm:space-y-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{step.number}</span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center space-y-2.5 sm:space-y-3">
          <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 font-bold text-[10px] sm:text-xs">
            CANDIDATE REVIEWS
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved By Job Seekers
          </h2>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-xs text-white shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-indigo-600 p-6 sm:p-14 text-center shadow-xl">
          <div className="relative z-10 space-y-3 sm:space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Supercharge Your Job Search?
            </h2>
            <p className="text-indigo-100 text-xs sm:text-base leading-relaxed">
              Join thousands of candidates using ApplyAI to automate job applications, pass ATS resume checks, and land top offers.
            </p>
            <div className="pt-2">
              <Link href="/register">
                <Button size="lg" className="min-h-[48px] px-6 sm:px-8 bg-white text-indigo-700 hover:bg-slate-100 rounded-xl font-bold text-xs sm:text-sm shadow-md gap-2 w-full sm:w-auto">
                  <span>Get Started Free</span> <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
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
            <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[44px] flex items-center">Sign In</Link>
            <Link href="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[44px] flex items-center">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
