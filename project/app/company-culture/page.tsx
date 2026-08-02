'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Sparkles,
  Search,
  CheckCircle2,
  Users,
  Briefcase,
  Heart,
  Smile,
  Globe,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface CultureInsight {
  company: string;
  wfhPolicy: string;
  workLifeBalanceRating: string;
  cultureRating: string;
  techStack: string[];
  pros: string[];
  cons: string[];
  sentimentScore: number;
}

export default function CompanyCulturePage() {
  const { toast } = useToast();
  const [searchCompany, setSearchCompany] = useState('Google');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<CultureInsight | null>({
    company: 'Google',
    wfhPolicy: 'Hybrid (3 Days Office / 2 Days Remote) + 4 Weeks Work-From-Anywhere',
    workLifeBalanceRating: '4.4 / 5.0 (Flexible Hours)',
    cultureRating: '4.6 / 5.0 (High Innovation)',
    techStack: ['TypeScript', 'Go', 'C++', 'Kubernetes', 'Borg', 'Angular/React'],
    pros: [
      'Top-tier engineering talent & high technical standards',
      'Extensive learning budget, 20% innovation project time',
      'Competitive equity (GSUs) & annual performance bonuses',
    ],
    cons: [
      'Large matrix organization requiring multi-team alignment',
      'Slower promotion cycles at senior staff levels',
    ],
    sentimentScore: 92,
  });

  const handleAnalyze = () => {
    if (!searchCompany.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setInsight({
        company: searchCompany,
        wfhPolicy: 'Flexible Hybrid / Full Remote options supported',
        workLifeBalanceRating: '4.3 / 5.0',
        cultureRating: '4.5 / 5.0',
        techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
        pros: [
          'Strong engineering autonomy & modern cloud tech stack',
          'Transparent leadership & regular hackathons',
          'Generous health, wellness, and continuous learning perks',
        ],
        cons: [
          'Fast-paced delivery sprints during major product releases',
        ],
        sentimentScore: 89,
      });

      setIsAnalyzing(false);
      toast({
        title: `✅ ${searchCompany} Culture Analyzed`,
        description: 'Retrieved WFH policy, work-life balance, and tech stack insights.',
      });
    }, 600);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-purple-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Company Culture Insights
                </h1>
                <Badge className="bg-purple-950 text-purple-400 border border-purple-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  CULTURE &amp; WFH
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Analyze work-life balance scores, WFH remote policies, and tech stack transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            placeholder="Search target company (e.g. Google, TechNova Systems, Microsoft)..."
            className="rounded-xl border-slate-200 dark:border-slate-800 text-xs h-11"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl gap-2 shadow-md"
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>Analyze Culture</span>
          </Button>
        </div>

        {/* Insights Display Output */}
        {insight && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: WFH Policy */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  <span>REMOTE / WFH POLICY</span>
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">{insight.wfhPolicy}</p>
              </Card>

              {/* Card 2: Work-Life Balance */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  <span>WORK-LIFE BALANCE</span>
                </span>
                <p className="font-black text-slate-900 dark:text-white text-lg">{insight.workLifeBalanceRating}</p>
              </Card>

              {/* Card 3: Employee Sentiment Score */}
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Smile className="h-3.5 w-3.5 text-emerald-500" />
                  <span>EMPLOYEE SENTIMENT SCORE</span>
                </span>
                <p className="font-black text-emerald-600 dark:text-emerald-400 text-2xl">{insight.sentimentScore}%</p>
              </Card>

            </div>

            {/* Tech Stack & Culture Highlights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Tech Stack */}
              <Card className="lg:col-span-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-3 shadow-sm">
                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Core Engineering Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {insight.techStack.map((tech) => (
                    <Badge key={tech} className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Culture Pros & Cons */}
              <Card className="lg:col-span-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-3 shadow-sm">
                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Culture Highlights &amp; Pros
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {insight.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </Card>

            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
}
