'use client';

import { Check, X } from 'lucide-react';

interface PasswordMeterProps {
  password?: string;
}

export interface PasswordRules {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function evaluatePasswordRules(password: string = ''): PasswordRules {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordValid(password: string = ''): boolean {
  const rules = evaluatePasswordRules(password);
  return rules.length && rules.uppercase && rules.lowercase && rules.number && rules.special;
}

export function PasswordMeter({ password = '' }: PasswordMeterProps) {
  if (!password) return null;

  const rules = evaluatePasswordRules(password);
  const passedCount = Object.values(rules).filter(Boolean).length;

  let label = 'Weak';
  let colorClass = 'bg-rose-500';
  let textClass = 'text-rose-600 dark:text-rose-400';

  if (passedCount >= 5) {
    label = 'Strong';
    colorClass = 'bg-emerald-500';
    textClass = 'text-emerald-600 dark:text-emerald-400';
  } else if (passedCount >= 3) {
    label = 'Medium';
    colorClass = 'bg-amber-500';
    textClass = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <div className="space-y-2 pt-1">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600 dark:text-slate-400">Password Strength:</span>
        <span className={`font-bold ${textClass}`}>{label}</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full transition-all duration-300 ${
              level <= passedCount ? colorClass : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1">
        <div className={`flex items-center gap-1.5 ${rules.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          {rules.length ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0 text-slate-300" />}
          <span>Min 8 characters</span>
        </div>
        <div className={`flex items-center gap-1.5 ${rules.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          {rules.uppercase ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0 text-slate-300" />}
          <span>1 Uppercase (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${rules.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          {rules.lowercase ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0 text-slate-300" />}
          <span>1 Lowercase (a-z)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${rules.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          {rules.number ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0 text-slate-300" />}
          <span>1 Number (0-9)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${rules.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} col-span-2 sm:col-span-1`}>
          {rules.special ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0 text-slate-300" />}
          <span>1 Special Symbol</span>
        </div>
      </div>
    </div>
  );
}
