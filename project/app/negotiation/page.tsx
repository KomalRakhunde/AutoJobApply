'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName } from '@/lib/utils';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function NegotiationPage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const candidateName = getDisplayName(user);

  const [companyName, setCompanyName] = useState('TechNova Systems');
  const [initialOfferBase, setInitialOfferBase] = useState('22 LPA ($130,000 Base)');
  const [targetBase, setTargetBase] = useState('28 LPA ($160,000 Base)');
  const [compDetails, setCompDetails] = useState('10% Annual Bonus + 15,000 Stock Options (4-yr vesting)');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const script = `Dear Hiring Team / Recruiter at ${companyName},\n\nThank you so much for extending the offer for the Software Engineer role! I am thrilled about the opportunity to join ${companyName} and contribute to your engineering goals.\n\nAfter evaluating the initial base offer of ${initialOfferBase} against current market benchmarks for my experience level in Next.js, Node.js, and distributed systems, I would like to discuss adjusting the base compensation to ${targetBase}.\n\nGiven my proven track record of reducing latency by 38% and scaling microservices, I am confident I will drive immediate ROI. If we can align closer to ${targetBase}, I am prepared to sign and accept immediately!\n\nThank you for your flexibility and support.\n\nBest regards,\n${candidateName}`;

      setGeneratedScript(script);
      setIsGenerating(false);
      toast({
        title: '✨ Counter-Offer Script Drafted',
        description: 'Negotiation email template generated.',
      });
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    toast({
      title: '📋 Counter-Offer Script Copied',
      description: 'Ready to email your recruiter.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-black shadow-lg shadow-emerald-500/20">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  AI Salary Negotiation Assistant
                </h1>
                <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  COMPENSATION ENGINE
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Generate professional counter-offer scripts and maximize base salary, bonus, and equity packages.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Offer Settings Form */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span>Offer Parameters</span>
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Hiring Company</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Initial Offere Base Salary</Label>
                  <Input
                    value={initialOfferBase}
                    onChange={(e) => setInitialOfferBase(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Target Counter Base Salary</Label>
                  <Input
                    value={targetBase}
                    onChange={(e) => setTargetBase(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Bonus &amp; Stock Equity Details</Label>
                  <Input
                    value={compDetails}
                    onChange={(e) => setCompDetails(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl gap-2 shadow-md shadow-emerald-500/20 mt-2"
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
                  <span>{isGenerating ? 'Drafting Script...' : 'Generate Counter-Offer Script'}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Generated Script Display */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>COUNTER-OFFER EMAIL TEMPLATE</span>
                </span>

                {generatedScript && (
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-1.5 py-1.5 px-3"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                  </Button>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap min-h-[250px]">
                {generatedScript || (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2 font-sans">
                    <Award className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-medium">Click "Generate Counter-Offer Script" to craft your negotiation email.</p>
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
