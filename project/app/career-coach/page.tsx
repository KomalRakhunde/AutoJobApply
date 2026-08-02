'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Sparkles,
  TrendingUp,
  BookOpen,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  ArrowUpRight,
  Layers,
  Award,
} from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import Link from 'next/link';

export default function CareerCoachPage() {
  const user = useAppSelector((s) => s.auth.user);
  const rawUsername = user?.email ? user.email.split('@')[0] : 'Candidate';
  const candidateName =
    rawUsername.split('.')[0].charAt(0).toUpperCase() + rawUsername.split('.')[0].slice(1);

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'courses' | 'resume' | 'salary' | 'path'>('overview');

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Title & Executive Summary Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wider">
              <Brain className="h-4 w-4" />
              <span>AI CAREER COACH &amp; ADVISOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Personalized Career Strategy for {candidateName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              AI-driven insights on missing skills, targeted courses, resume optimizations, and salary benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-slate-800 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">CAREER READINESS</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">88% Match</span>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400 block">SALARY POTENTIAL</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">24-32 LPA</span>
            </div>
          </div>
        </div>

        {/* 5 Feature Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Overview & Summary', icon: Brain },
            { id: 'skills', label: 'Missing Skills', icon: AlertTriangle },
            { id: 'courses', label: 'Recommended Courses', icon: BookOpen },
            { id: 'resume', label: 'Resume Improvements', icon: Sparkles },
            { id: 'salary', label: 'Salary Expectations', icon: DollarSign },
            { id: 'path', label: 'Career Path', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#121522] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 5 FEATURE SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Main Feature Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 1: MISSING SKILLS ANALYSIS */}
            {(activeTab === 'overview' || activeTab === 'skills') && (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      1. Missing Skills Analysis
                    </h3>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[10px]">
                    3 HIGH-IMPACT GAPS
                  </Badge>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">Distributed System Architecture (Kubernetes / Docker)</span>
                        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-extrabold">CRITICAL</Badge>
                      </div>
                      <p className="text-slate-500 font-normal leading-relaxed">
                        Required in 84% of target Senior Software Engineer job descriptions. Master container orchestration to unlock Tier-1 roles.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">GraphQL API Schema &amp; Apollo Federation</span>
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[9px] font-extrabold">RECOMMENDED</Badge>
                      </div>
                      <p className="text-slate-500 font-normal leading-relaxed">
                        Highly requested by high-growth startups for microservices frontend communication.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">A/B Testing &amp; Quantitative Experimentation Frameworks</span>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[9px] font-extrabold">GOOD TO HAVE</Badge>
                      </div>
                      <p className="text-slate-500 font-normal leading-relaxed">
                        Demonstrates data-driven product engineering mindset required for Product Lead progression.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* SECTION 2: RECOMMENDED COURSES */}
            {(activeTab === 'overview' || activeTab === 'courses') && (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      2. Recommended Learning Courses
                    </h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-[10px]">
                    CURATED PATHWAY
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 text-[9px] font-extrabold">DevOps &amp; Cloud</Badge>
                      <span className="text-[10px] text-slate-400 font-bold">14 Hours</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">AWS Certified Solutions Architect &amp; Kubernetes Deep Dive</h4>
                    <p className="text-slate-500 text-[11px] font-normal leading-relaxed">
                      Hands-on deployment of production-grade microservices and load balancing.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 text-[9px] font-extrabold">System Design</Badge>
                      <span className="text-[10px] text-slate-400 font-bold">10 Hours</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">High-Scale Distributed Systems Architecture</h4>
                    <p className="text-slate-500 text-[11px] font-normal leading-relaxed">
                      Learn caching strategies, event queues, and sub-50ms latency techniques.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* SECTION 3: RESUME IMPROVEMENTS */}
            {(activeTab === 'overview' || activeTab === 'resume') && (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      3. Resume Improvement Suggestions
                    </h3>
                  </div>
                  <Link href="/resume">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-8 gap-1">
                      <span>Open Resume Studio</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-1.5">
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-xs block">
                      ⚡ Quantify Bullet Points with Metrics
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      Replace vague descriptions like "Worked on frontend dashboard" with <span className="font-extrabold text-slate-900 dark:text-white">"Spearheaded Next.js frontend redesign for 500k+ MAU, reducing LCP page load by 38%."</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                      📌 Add ATS Keyword Density Section
                    </span>
                    <p className="text-slate-500 leading-relaxed font-normal">
                      Include a dedicated "Core Technical Competencies" block containing <span className="font-bold text-blue-600">TypeScript, React, Node.js, PostgreSQL, Docker, AWS</span> at the top of your resume.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* SECTION 4: SALARY EXPECTATIONS */}
            {(activeTab === 'overview' || activeTab === 'salary') && (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      4. Market Salary Expectations &amp; Benchmarks
                    </h3>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px]">
                    2026 MARKET DATA
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ENTRY / MID LEVEL</span>
                    <p className="text-base font-black text-slate-900 dark:text-white">14 - 20 LPA</p>
                    <p className="text-[10.5px] text-slate-500 font-medium">($90k - $125k Base)</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 space-y-1">
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">TARGET SENIOR LEVEL (GOAL)</span>
                    <p className="text-base font-black text-blue-600 dark:text-blue-400">24 - 35 LPA</p>
                    <p className="text-[10.5px] text-blue-500 font-bold">($140k - $185k Base + Stocks)</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">STAFF / PRINCIPAL LEAD</span>
                    <p className="text-base font-black text-slate-900 dark:text-white">40 - 60 LPA</p>
                    <p className="text-[10.5px] text-slate-500 font-medium">($200k - $280k Total Comp)</p>
                  </div>
                </div>
              </Card>
            )}

            {/* SECTION 5: CAREER PATH ROADMAP */}
            {(activeTab === 'overview' || activeTab === 'path') && (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      5. 3-Year Career Path Progression
                    </h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 font-bold text-xs">
                    ROADMAP ACTIVE
                  </Badge>
                </div>

                <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 font-sans text-xs">
                  
                  {/* Step 1 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0e17]" />
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs">Year 1: Software Engineer / Full Stack Specialist</span>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 text-[9px] font-bold">CURRENT STAGE</Badge>
                    </div>
                    <p className="text-slate-500 font-normal">
                      Focus on delivering production code, mastering React/Next.js and Node.js microservices, and raising test coverage.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-blue-600 border-2 border-white dark:border-[#0c0e17]" />
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs">Year 2: Senior Software Engineer / Module Lead</span>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 text-[9px] font-bold">TARGET NEXT</Badge>
                    </div>
                    <p className="text-slate-500 font-normal">
                      Architect scalable backend APIs, lead technical code reviews, and mentor junior candidates.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-indigo-600 border-2 border-white dark:border-[#0c0e17]" />
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs">Year 3+: Staff Engineer / Principal Technical Architect</span>
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 text-[9px] font-bold">LONG TERM GOAL</Badge>
                    </div>
                    <p className="text-slate-500 font-normal">
                      Drive cross-organizational platform strategy, multi-region cloud infrastructure, and technical vision.
                    </p>
                  </div>

                </div>
              </Card>
            )}

          </div>

          {/* RIGHT COLUMN: AI Summary Widget */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border border-slate-800 bg-[#0c0e17] text-white p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs">
                <Brain className="h-4 w-4" />
                <span>AI COACH ADVISORY</span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <p className="text-slate-300 leading-relaxed font-medium">
                  "Hello {candidateName}! Based on your profile and recent applications, adding <span className="font-bold text-white">Kubernetes</span> and <span className="font-bold text-white">System Design</span> to your resume will boost your ATS match score to 95% and qualify you for Senior Engineer salary bands."
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">ACTIONABLE NEXT STEPS</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Complete AWS &amp; Kubernetes course (14h)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>Apply AI bullet point rewrites in Resume Studio</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Practice 3 System Design interview simulations</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </PageShell>
  );
}
