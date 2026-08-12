'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  FileText,
  Briefcase,
  Mail,
  KanbanSquare,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export interface JourneyStep {
  id: string;
  stepNumber: number;
  label: string;
  href: string;
  icon: any;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  { id: 'profile', stepNumber: 1, label: 'Edit Profile & Domain', href: '/profile', icon: User },
  { id: 'resume', stepNumber: 2, label: 'ATS Resume Analysis', href: '/resume', icon: FileText },
  { id: 'jobs', stepNumber: 3, label: 'AI Job Match & 1-Click Apply', href: '/jobs', icon: Briefcase },
  { id: 'email-sync', stepNumber: 4, label: 'Gmail Dispatch & Outreach', href: '/email-sync', icon: Mail },
  { id: 'applications', stepNumber: 5, label: 'Application Tracker', href: '/applications', icon: KanbanSquare },
];

export function CandidateJourneyStepper({ currentStepId }: { currentStepId: string }) {
  const pathname = usePathname();
  const currentStepIndex = JOURNEY_STEPS.findIndex((s) => s.id === currentStepId);

  return (
    <div className="w-full bg-slate-900/90 text-white rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-md mb-6 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
            {currentStepIndex + 1}
          </span>
          <span className="font-extrabold text-sm text-white tracking-tight">
            5-Step Interconnected Candidate Pipeline
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Step {currentStepIndex + 1} of 5: <strong className="text-blue-400">{JOURNEY_STEPS[currentStepIndex]?.label}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {JOURNEY_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.id === currentStepId;
          const isCompleted = idx < currentStepIndex;

          return (
            <Link
              key={step.id}
              href={step.href}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-blue-600 border-blue-500 text-white font-extrabold shadow-md shadow-blue-600/30'
                  : isCompleted
                  ? 'bg-slate-800/80 border-slate-700 text-emerald-400 font-bold hover:bg-slate-800'
                  : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                  isCurrent
                    ? 'bg-white text-blue-600'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <div className="truncate">
                <p className="text-[10px] uppercase font-black text-slate-400 leading-none">Step {step.stepNumber}</p>
                <p className="text-xs truncate font-bold mt-0.5">{step.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
