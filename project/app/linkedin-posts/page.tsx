'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName } from '@/lib/utils';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Send,
  Zap,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export default function LinkedInPostsPage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const candidateName = getDisplayName(user);

  const [postTopic, setPostTopic] = useState('Open to Software Engineering Opportunities');
  const [postTone, setPostTone] = useState<'Professional' | 'Storytelling' | 'Technical Insights' | 'Milestone'>('Professional');
  const [keySkills, setKeySkills] = useState('React, Next.js, Node.js, PostgreSQL, Distributed Systems');
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let postContent = '';
      if (postTone === 'Professional') {
        postContent = `🚀 Excited to announce that I am officially OPEN TO WORK as a Senior Full Stack Software Engineer!\n\nOver the past 5+ years, I've specialized in building high-scale web platforms using ${keySkills}. I'm passionate about clean architecture, performance optimization, and shipping products that impact users at scale.\n\nIf your team is looking for a driven engineer to solve complex technical challenges, let's connect! DM or reach out directly.\n\n#OpenToWork #SoftwareEngineering #ReactJS #NodeJS #FullStackDeveloper #TechCareers`;
      } else if (postTone === 'Storytelling') {
        postContent = `💡 "Great engineering isn't just about writing code; it's about solving real human problems at scale."\n\nRecently, I spearheaded a core architecture overhaul that reduced frontend page load times by 38% and scaled our API gateway to handle 5M+ daily requests.\n\nWorking with ${keySkills} has taught me that continuous optimization makes all the difference. Currently exploring my next impactful engineering role!\n\n#SoftwareDevelopment #EngineeringCulture #SystemDesign #TechJourney #CareerGrowth`;
      } else if (postTone === 'Technical Insights') {
        postContent = `⚡ Technical Deep-Dive: Why micro-frontend architecture combined with Next.js App Router improves developer velocity.\n\nHere are 3 key takeaways from my latest system build:\n1️⃣ Server Components drastically reduce client-side JavaScript bundle sizes.\n2️⃣ Granular caching policies eliminate redundant API calls.\n3️⃣ Strict TypeScript typings prevent runtime production crashes.\n\nStack: ${keySkills}.\n\n#TypeScript #NextJS #FrontendArchitecture #WebPerformance #SoftwareEngineering`;
      } else {
        postContent = `🎉 Milestone Achieved! Excited to share my latest technical milestone in building distributed systems using ${keySkills}.\n\nLooking forward to joining a fast-paced engineering team to build next-generation products.\n\n#CareerMilestone #SoftwareEngineer #TechJobs #React #NodeJS`;
      }

      setGeneratedPost(postContent);
      setIsGenerating(false);
      toast({
        title: '✨ LinkedIn Post Generated',
        description: 'Formatted LinkedIn post ready for publishing.',
      });
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    toast({
      title: '📋 Copied to Clipboard',
      description: 'Post copied! Ready to paste into LinkedIn.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-500/20">
              <Share2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  LinkedIn Post Generator
                </h1>
                <Badge className="bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  AI GROWTH TOOL
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Generate high-engagement LinkedIn posts for job announcements, technical insights, and career wins.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Controls (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Post Generator Settings</span>
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Post Tone / Objective</Label>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {(['Professional', 'Storytelling', 'Technical Insights', 'Milestone'] as const).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setPostTone(tone)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          postTone === tone
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Post Topic / Headline</Label>
                  <Input
                    value={postTopic}
                    onChange={(e) => setPostTopic(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">Featured Skills &amp; Tech Stack</Label>
                  <Input
                    value={keySkills}
                    onChange={(e) => setKeySkills(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl gap-2 shadow-md shadow-blue-500/20 mt-2"
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{isGenerating ? 'Drafting Post...' : 'Generate LinkedIn Post'}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: LinkedIn Post Card Preview (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                    {candidateName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{candidateName}</p>
                    <p className="text-[10px] text-slate-400">Software Engineer • 1m ago</p>
                  </div>
                </div>

                {generatedPost && (
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-1.5 py-1.5 px-3"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Post'}</span>
                  </Button>
                )}
              </div>

              {/* Post Content Body */}
              <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-wrap min-h-[220px]">
                {generatedPost || (
                  <div className="h-44 flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Share2 className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-medium">Click "Generate LinkedIn Post" to draft your professional post.</p>
                  </div>
                )}
              </div>

              {/* Fake Reactions bar */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-blue-500" />
                  <span>48 Likes • 12 Comments</span>
                </div>
                <span>Targeted for recruiters</span>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </PageShell>
  );
}
