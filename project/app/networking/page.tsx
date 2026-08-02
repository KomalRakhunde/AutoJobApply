'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName, copyToClipboard } from '@/lib/utils';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Compass,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Send,
  UserCheck,
  MessageCircle,
  Building2,
} from 'lucide-react';

export default function NetworkingPage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const candidateName = getDisplayName(user);

  const [recipientName, setRecipientName] = useState('Sarah Jenkins');
  const [recipientRole, setRecipientRole] = useState('Engineering Manager');
  const [targetCompany, setTargetCompany] = useState('TechNova Systems');
  const [outreachType, setOutreachType] = useState<'Cold Connection' | 'Alumni Outreach' | 'Recruiter Follow-up' | 'Informational Interview'>('Cold Connection');
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let msg = '';
      if (outreachType === 'Cold Connection') {
        msg = `Hi ${recipientName},\n\nI came across your profile while exploring engineering leadership at ${targetCompany}. Your work with high-throughput cloud architecture is super inspiring!\n\nI'm ${candidateName}, a Senior Full Stack Engineer. I'd love to connect and follow your team's tech updates!\n\nBest regards,\n${candidateName}`;
      } else if (outreachType === 'Alumni Outreach') {
        msg = `Hi ${recipientName},\n\nI noticed we're both alumni! I'm currently exploring Software Engineering roles at ${targetCompany} and would love to hear about your experience on the engineering team.\n\nWould you be open to a brief 5-minute chat or connection?\n\nBest,\n${candidateName}`;
      } else if (outreachType === 'Recruiter Follow-up') {
        msg = `Hi ${recipientName},\n\nFollowing up on my recent application for the Software Engineer position at ${targetCompany}. Given my background in React, Next.js, and Node.js microservices, I'm confident I can make an immediate impact on your team.\n\nThank you for your time and consideration!\n\nBest,\n${candidateName}`;
      } else {
        msg = `Hi ${recipientName},\n\nI really admire the engineering culture at ${targetCompany}. As a Full Stack Engineer passionate about scaling distributed systems, I'd love to ask a couple of quick questions about your team's tech stack.\n\nThanks in advance for your time!\n\nWarmly,\n${candidateName}`;
      }

      setGeneratedMessage(msg);
      setIsGenerating(false);
      toast({
        title: '✨ Networking Note Drafted',
        description: 'Personalized outreach note ready for LinkedIn / Email.',
      });
    }, 600);
  };

  const handleCopy = async () => {
    if (!generatedMessage) return;
    await copyToClipboard(generatedMessage);
    setCopied(true);
    toast({
      title: '📋 Message Copied',
      description: 'Ready to send on LinkedIn or Email!',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  AI Networking Assistant
                </h1>
                <Badge className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  OUTREACH ENGINE
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Generate high-converting connection notes for hiring managers, alumni, and recruiters.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Settings */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  <span>Outreach Configuration</span>
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Outreach Purpose</Label>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {(['Cold Connection', 'Alumni Outreach', 'Recruiter Follow-up', 'Informational Interview'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setOutreachType(t)}
                        className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                          outreachType === t
                            ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Recipient Name</Label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Recipient Title &amp; Role</Label>
                  <Input
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Target Company</Label>
                  <Input
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs py-2.5 rounded-xl gap-2 shadow-md shadow-cyan-500/20 mt-2"
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>{isGenerating ? 'Drafting Message...' : 'Generate Networking Message'}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Generated Message Display */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4 text-cyan-500" />
                  <span>DRAFT OUTREACH MESSAGE</span>
                </span>

                {generatedMessage && (
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-1.5 py-1.5 px-3"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Message'}</span>
                  </Button>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap min-h-[240px]">
                {generatedMessage || (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2 font-sans">
                    <UserCheck className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-medium">Click "Generate Networking Message" to draft personalized outreach.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>

      </div>
    </PageShell>
  );
}
