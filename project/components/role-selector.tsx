'use client';

import type { UserRole } from '@/lib/types';
import { GraduationCap, Briefcase, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

export interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  badge: string;
  icon: typeof GraduationCap;
  color: string;
  borderActive: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'student',
    title: 'Student / Job Seeker',
    subtitle: 'Optimize resumes, track applications, and auto-apply to jobs.',
    badge: 'Candidate',
    icon: GraduationCap,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    borderActive: 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20',
  },
  {
    id: 'recruiter',
    title: 'Recruiter / Employer',
    subtitle: 'Post job openings, review ATS scores, and manage talent pipeline.',
    badge: 'Employer',
    icon: Briefcase,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    borderActive: 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20',
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Manage organization users, job listings, and team metrics.',
    badge: 'Org Admin',
    icon: ShieldCheck,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    borderActive: 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
  },
  {
    id: 'super_admin',
    title: 'Super Admin',
    subtitle: 'Full system control, subscription billing, and platform analytics.',
    badge: 'System',
    icon: Zap,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    borderActive: 'border-amber-600 dark:border-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
  },
];

export function RoleSelector({
  selectedRole,
  onSelectRole,
}: {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
        Select your portal role
      </label>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {ROLE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedRole === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onSelectRole(option.id)}
              className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                isSelected
                  ? option.borderActive + ' shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${option.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {option.title}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />
                  )}
                </div>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400 line-clamp-2">
                  {option.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
