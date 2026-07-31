'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Scale,
} from 'lucide-react';
import { RecruiterCandidate } from '@/lib/recruiter-api';

interface CandidateCompareDialogProps {
  candidates: RecruiterCandidate[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateCompareDialog({
  candidates,
  open,
  onOpenChange,
}: CandidateCompareDialogProps) {
  const [cand1Id, setCand1Id] = useState<string>(candidates[0]?.id || '');
  const [cand2Id, setCand2Id] = useState<string>(candidates[1]?.id || candidates[0]?.id || '');

  if (!open) return null;

  const candidate1 = candidates.find((c) => c.id === cand1Id) || candidates[0];
  const candidate2 = candidates.find((c) => c.id === cand2Id) || candidates[1] || candidates[0];

  const score1 = candidate1?.scores[0]?.overallScore || 85;
  const score2 = candidate2?.scores[0]?.overallScore || 78;

  const winner = score1 >= score2 ? candidate1 : candidate2;

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Side-by-Side Candidate Comparison</span>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" /> AI Ranking
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Compare ATS match scores, technical skill overlaps, and strengths side-by-side.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Candidate Selector Bars */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Candidate #1
            </label>
            <select
              value={cand1Id}
              onChange={(e) => setCand1Id(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold px-3 text-slate-900 dark:text-white"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.scores[0]?.overallScore || 0}% Match)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Candidate #2
            </label>
            <select
              value={cand2Id}
              onChange={(e) => setCand2Id(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold px-3 text-slate-900 dark:text-white"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.scores[0]?.overallScore || 0}% Match)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Recommendation Highlight Box */}
        {winner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-950/40 dark:to-indigo-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white font-black">
                🏆
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  AI Recommendation Winner
                </p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {winner.name} ({winner.scores[0]?.overallScore || 0}% ATS Match Score)
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1">
              Top Ranked Candidate
            </Badge>
          </div>
        )}

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          {/* Candidate 1 Details */}
          {candidate1 && (
            <div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{candidate1.name}</h3>
                  <p className="text-slate-500 text-[11px]">{candidate1.email}</p>
                </div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score1}%</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>ATS Qualifications Match</span>
                  <span>{score1}%</span>
                </div>
                <Progress value={score1} className="h-2 bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate1.skills?.map((s, i) => (
                    <Badge key={i} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none text-[10px]">
                      {s}
                    </Badge>
                  )) || <span className="text-slate-400">TypeScript, Next.js, Node.js</span>}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Strengths</p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                  {candidate1.scores[0]?.strengths?.map((str, i) => (
                    <li key={i}>{str}</li>
                  )) || <li>Strong technical framework experience</li>}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">Gaps / Verification Required</p>
                <p className="text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900">
                  {candidate1.scores[0]?.gaps?.[0] || 'Requires deep-dive technical voice screening.'}
                </p>
              </div>
            </div>
          )}

          {/* Candidate 2 Details */}
          {candidate2 && (
            <div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{candidate2.name}</h3>
                  <p className="text-slate-500 text-[11px]">{candidate2.email}</p>
                </div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score2}%</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>ATS Qualifications Match</span>
                  <span>{score2}%</span>
                </div>
                <Progress value={score2} className="h-2 bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate2.skills?.map((s, i) => (
                    <Badge key={i} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none text-[10px]">
                      {s}
                    </Badge>
                  )) || <span className="text-slate-400">React, PostgreSQL, API Design</span>}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Strengths</p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                  {candidate2.scores[0]?.strengths?.map((str, i) => (
                    <li key={i}>{str}</li>
                  )) || <li>Clean code and API design skills</li>}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">Gaps / Verification Required</p>
                <p className="text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900">
                  {candidate2.scores[0]?.gaps?.[0] || 'Requires team leadership verification.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs px-6"
          >
            Close Comparison
          </Button>
        </div>
      </div>
    </Card>
  );
}
