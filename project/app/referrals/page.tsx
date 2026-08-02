'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName, copyToClipboard } from '@/lib/utils';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  Building2,
} from 'lucide-react';

export default function ReferralsPage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const candidateName = getDisplayName(user);

  const [companyName, setCompanyName] = useState('Google');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isSearching, setIsSearching] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${companyName} software engineer referral`)}`;

  const referralTemplates = [
    {
      title: 'Warm Connection Referral Request',
      text: `Hi [Name],\n\nHope you're having a great week! I noticed an opening for ${targetRole} at ${companyName} and was really excited about the team's work.\n\nGiven your experience at ${companyName}, I'd love to learn more about the engineering culture. If open to it, would you be comfortable referring my profile for this role?\n\nHere is my resume: [Resume Link]\n\nThanks so much!\n\nBest,\n${candidateName}`,
    },
    {
      title: 'Alumni Outreach Request',
      text: `Hello [Name],\n\nI saw that we both attended [University Name]! I'm currently exploring a ${targetRole} position at ${companyName}.\n\nI'd love to connect and hear your perspective on working at ${companyName}. Also, if comfortable, a quick internal referral would mean the world to me.\n\nBest regards,\n${candidateName}`,
    },
    {
      title: 'Mutual Connection Referral Request',
      text: `Hi [Name],\n\nHope you're doing well! I'm applying for a ${targetRole} role at ${companyName} and saw that you are connected with engineering leadership there.\n\nIf comfortable, would you be willing to introduce me or share an internal referral link?\n\nReally appreciate your help!\n\nBest regards,\n${candidateName}`,
    },
  ];

  const handleCopy = async (text: string, idx: number) => {
    await copyToClipboard(text);
    setCopiedIdx(idx);
    toast({
      title: '📋 Referral Request Copied',
      description: 'Ready to send to your target contact!',
    });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black shadow-lg shadow-orange-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Referral Finder AI
                </h1>
                <Badge className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  NETWORKING BOOSTER
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Find alumni and internal employees at target companies and generate 1-click referral requests.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Target Company Search */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  <span>Target Referral Parameters</span>
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Target Company</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Target Role Title</Label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="block pt-2">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2.5 rounded-xl gap-2 shadow-md shadow-amber-500/20">
                    <Search className="h-4 w-4" />
                    <span>Search LinkedIn Alumni for {companyName}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {/* Referral Request Templates */}
          <div className="lg:col-span-7 space-y-4">
            {referralTemplates.map((template, idx) => (
              <Card key={idx} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    {template.title}
                  </span>
                  <Button
                    onClick={() => handleCopy(template.text, idx)}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-1.5 py-1 px-3"
                  >
                    {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedIdx === idx ? 'Copied!' : 'Copy Template'}</span>
                  </Button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                  {template.text}
                </div>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </PageShell>
  );
}
