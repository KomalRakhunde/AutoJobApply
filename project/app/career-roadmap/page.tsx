'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  RotateCw,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Brain,
} from 'lucide-react';

export default function CareerRoadmapPage() {
  const [radarData, setRadarData] = useState({
    leadership: 75,
    technical: 65,
    strategy: 85,
    analytics: 70,
  });

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Title & Overview Badges Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Product Management Roadmap
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Strategic path to Senior PM at Tier-1 Tech companies.
            </p>
          </div>

          {/* Right Badges */}
          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-0.5 min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Estimated Timeline
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                14 Months
              </span>
            </div>

            <div className="p-3 px-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 shadow-2xs text-center space-y-0.5 min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                Career Readiness
              </span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400 tracking-tight">
                72%
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: MILESTONES (lg:col-span-3) */}
          <Card className="lg:col-span-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                MILESTONES
              </span>
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Vertical Timeline Tree */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              
              {/* Milestone 1: COMPLETED */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  COMPLETED
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                  Foundations of Product
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  CS50P & Product School Cert 101.
                </p>
              </div>

              {/* Milestone 2: CURRENT FOCUS Card */}
              <div className="relative space-y-2">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-blue-600 bg-white dark:bg-[#0c0e17]" />
                
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 space-y-2">
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    CURRENT FOCUS
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Technical Systems Design
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    System design interviews & API architecture basics.
                  </p>
                  
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Milestone 3: MONTH 9 */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  MONTH 9
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                  Data Driven Decisions
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Advanced SQL for PMs & A/B testing frameworks.
                </p>
              </div>

              {/* Milestone 4: MONTH 12 */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  MONTH 12
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                  Go-to-Market Strategy
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Pricing, distribution, and scale operations.
                </p>
              </div>

            </div>
          </Card>

          {/* COLUMN 2: Skill Gap Analysis Radar Chart (lg:col-span-5) */}
          <Card className="lg:col-span-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-5 shadow-xs flex flex-col justify-between min-h-[500px]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Skill Gap Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Competency relative to 'Senior PM' benchmarks.
                </p>
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-xl">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Custom Interactive SVG Skill Radar Chart */}
            <div className="relative flex-1 flex items-center justify-center py-6">
              <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto overflow-visible">
                {/* Concentric Radar Grid Rings */}
                {[0.25, 0.5, 0.75, 1].map((r, idx) => (
                  <circle
                    key={idx}
                    cx="150"
                    cy="150"
                    r={110 * r}
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                    strokeDasharray={idx === 3 ? 'none' : '3 3'}
                  />
                ))}

                {/* Axis Lines */}
                <line x1="150" y1="40" x2="150" y2="260" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                <line x1="40" y1="150" x2="260" y2="150" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />

                {/* Benchmark Polyline (Gray Ring) */}
                <polygon
                  points="150,55 245,150 150,245 55,150"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-300 dark:text-slate-700"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Active Skill Area Polygon */}
                {/* Axes: Top=Leadership, Right=Technical, Bottom=Strategy, Left=Analytics */}
                <polygon
                  points={`
                    150,${150 - (radarData.leadership * 1.1)},
                    ${150 + (radarData.technical * 1.1)},150,
                    150,${150 + (radarData.strategy * 1.1)},
                    ${150 - (radarData.analytics * 1.1)},150
                  `}
                  className="fill-blue-500/20 stroke-blue-600 dark:stroke-blue-400"
                  strokeWidth="2.5"
                />

                {/* Radar Vertex Dots */}
                <circle cx="150" cy={150 - (radarData.leadership * 1.1)} r="5" className="fill-blue-600 dark:fill-blue-400" />
                <circle cx={150 + (radarData.technical * 1.1)} cy="150" r="5" className="fill-blue-600 dark:fill-blue-400" />
                <circle cx="150" cy={150 + (radarData.strategy * 1.1)} r="5" className="fill-blue-600 dark:fill-blue-400" />
                <circle cx={150 - (radarData.analytics * 1.1)} cy="150" r="5" className="fill-blue-600 dark:fill-blue-400" />

                {/* Labels */}
                <text x="150" y="25" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[11px] font-extrabold">Leadership</text>
                <text x="275" y="154" textAnchor="start" className="fill-slate-900 dark:fill-white text-[11px] font-extrabold">Technical</text>
                <text x="150" y="280" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[11px] font-extrabold">Strategy</text>
                <text x="25" y="154" textAnchor="end" className="fill-slate-900 dark:fill-white text-[11px] font-extrabold">Analytics</text>
              </svg>
            </div>
          </Card>

          {/* COLUMN 3: MARKET INTELLIGENCE & COURSES (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Dark Card: MARKET INTELLIGENCE */}
            <Card className="rounded-3xl border border-slate-800 bg-[#0c0e17] text-white p-6 space-y-4 shadow-xl">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                MARKET INTELLIGENCE
              </span>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-white">482</span>
                  <span className="text-xs font-extrabold text-slate-400">Roles Match</span>
                </div>
                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                  Your profile matches 82% of current Senior PM openings in SF/London.
                </p>
              </div>

              {/* Alumni Stack */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0e17] bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center">
                    AR
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0e17] bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center">
                    SK
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0e17] bg-indigo-500 text-white font-bold text-[9px] flex items-center justify-center">
                    MD
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0e17] bg-blue-700 text-white font-bold text-[9px] flex items-center justify-center">
                    +12
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-300">
                  Alumni working at target companies
                </span>
              </div>
            </Card>

            {/* BRIDGING THE GAP Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  BRIDGING THE GAP
                </span>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </button>
              </div>

              {/* Course Card 1 */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-3.5 flex items-center gap-3 shadow-xs hover:border-slate-300 transition-all cursor-pointer">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs overflow-hidden">
                  <span className="text-blue-400 text-lg">⚡</span>
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[9px] font-extrabold px-2 py-0.5 rounded">
                      Technical
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400">12h</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                    Microservices for PMs
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Master Kubernetes, Docker...
                  </p>
                </div>
              </Card>

              {/* Course Card 2 */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-3.5 flex items-center gap-3 shadow-xs hover:border-slate-300 transition-all cursor-pointer">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-950 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs overflow-hidden">
                  <span className="text-indigo-400 text-lg">📊</span>
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-extrabold px-2 py-0.5 rounded">
                      Strategy
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400">8h</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                    Advanced Product Metrics
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Building retention loops and...
                  </p>
                </div>
              </Card>

              {/* Course Card 3 */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-3.5 flex items-center gap-3 shadow-xs hover:border-slate-300 transition-all cursor-pointer">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-slate-900 to-blue-950 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs overflow-hidden">
                  <span className="text-cyan-400 text-lg">💾</span>
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[9px] font-extrabold px-2 py-0.5 rounded">
                      Analytics
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400">15h</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                    SQL for Decision Making
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Deep dive into PostgreSQL...
                  </p>
                </div>
              </Card>

            </div>

            {/* Light Blue Card: AI Career Coach */}
            <Card className="rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                <Brain className="h-4 w-4" />
                <span>AI Career Coach</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed italic">
                "Alex, you've improved your technical readiness score by +14% this month. Completing 'Microservices for PMs' will unlock Senior PM eligibility."
              </p>
            </Card>

          </div>

        </div>

      </div>
    </PageShell>
  );
}
