'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  TrendingUp,
  DollarSign,
  Layers,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  RotateCw,
  Save,
  Clock,
  Maximize2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LlmRoutingPage() {
  const { toast } = useToast();
  
  /* Routing States */
  const [gptActive, setGptActive] = useState(true);
  const [gptWeight, setGptWeight] = useState([70]);

  const [claudeActive, setClaudeActive] = useState(true);
  const [claudeWeight, setClaudeWeight] = useState([50]);

  const [geminiActive, setGeminiActive] = useState(false);
  const [geminiWeight, setGeminiWeight] = useState([40]);

  /* Active Prompt Tab */
  const [activePromptTab, setActivePromptTab] = useState<'parser' | 'cover' | 'voice'>('parser');
  const [promptText, setPromptText] = useState(
    `# System Role:\nYou are CareerSync AI Master Resume Parser v4. Extract candidate contact info, work history, education, skills, and quantified metrics into structured JSON schema.`
  );

  const handleDeployChanges = () => {
    toast({
      title: '🚀 Changes Deployed',
      description: 'LLM routing weights & system prompts updated across cluster.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
      
      {/* Top Header & Deploy Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            1.28s
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Global infrastructure control for LLM providers, load balancing, and prompt engineering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-2 py-2 px-4 shadow-xs"
          >
            <Clock className="h-4 w-4 text-slate-500" />
            <span>View Audit Logs</span>
          </Button>

          <Button
            onClick={handleDeployChanges}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-md gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Deploy Changes</span>
          </Button>
        </div>
      </div>

      {/* TOP INFRASTRUCTURE CARDS ROW (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: AVG. LATENCY */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AVG. LATENCY
            </span>
            <Zap className="h-4 w-4 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">1.24s</h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            ↓ 12% vs last hour
          </span>
        </Card>

        {/* Card 2: EST. MONTHLY COST */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              EST. MONTHLY COST
            </span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">$1,452.80</h2>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            ↑ 8.4% usage peak
          </span>
        </Card>

        {/* Card 3: TOKEN THROUGHPUT */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              TOKEN THROUGHPUT
            </span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">842k</h2>
          <span className="text-[11px] text-slate-400 font-normal">
            Total tokens processed today
          </span>
        </Card>

        {/* Card 4: SYSTEM HEALTH */}
        <Card className="rounded-2xl border border-slate-800 bg-[#090d16] text-white p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              SYSTEM HEALTH
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">99.98%</h2>
          <span className="text-[11px] text-slate-400 font-normal">
            Operational across 4 nodes
          </span>
        </Card>

      </div>

      {/* MIDDLE SECTION: LLM Provider Routing & Quota Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: LLM Provider Routing List */}
        <Card className="lg:col-span-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              LLM Provider Routing
            </h3>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
              • Live
            </Badge>
          </div>

          <div className="space-y-4">
            
            {/* Provider 1: GPT-4o (OpenAI) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0f111a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                    GPT-4o (OpenAI)
                  </h4>
                  <p className="text-xs text-slate-500">Primary reasoning engine</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="space-y-1 w-32">
                  <span className="text-[10px] font-bold text-slate-400 block">Weight</span>
                  <Slider value={gptWeight} onValueChange={setGptWeight} max={100} step={5} />
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 block">Status</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {gptActive ? 'Active' : 'Standby'}
                  </span>
                </div>

                <Switch checked={gptActive} onCheckedChange={setGptActive} />
              </div>
            </div>

            {/* Provider 2: Claude 3.5 Sonnet (Anthropic) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0f111a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Claude 3.5 Sonnet (Anthropic)
                  </h4>
                  <p className="text-xs text-slate-500">Creative & long-context writing</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="space-y-1 w-32">
                  <span className="text-[10px] font-bold text-slate-400 block">Weight</span>
                  <Slider value={claudeWeight} onValueChange={setClaudeWeight} max={100} step={5} />
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 block">Status</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {claudeActive ? 'Active' : 'Standby'}
                  </span>
                </div>

                <Switch checked={claudeActive} onCheckedChange={setClaudeActive} />
              </div>
            </div>

            {/* Provider 3: Gemini 1.5 Pro (Google) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0f111a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Gemini 1.5 Pro (Google)
                  </h4>
                  <p className="text-xs text-slate-500">Scalability & high-throughput</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="space-y-1 w-32">
                  <span className="text-[10px] font-bold text-slate-400 block">Weight</span>
                  <Slider value={geminiWeight} onValueChange={setGeminiWeight} max={100} step={5} />
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 block">Status</span>
                  <span className="text-xs font-extrabold text-slate-400">
                    {geminiActive ? 'Active' : 'Standby'}
                  </span>
                </div>

                <Switch checked={geminiActive} onCheckedChange={setGeminiActive} />
              </div>
            </div>

          </div>

          {/* Info Sticky Box */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <p>
              Load balancing is currently using <strong>Sticky Sessions</strong>. New requests will prefer GPT-4o for consistency across candidate sessions.
            </p>
          </div>
        </Card>

        {/* Right: Quota Management Widget */}
        <Card className="lg:col-span-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-5 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Quota Management
            </h3>
          </div>

          <div className="space-y-4">
            
            {/* Free Tier */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-white">Free Tier</span>
                <span className="text-slate-400">5,000 tokens/day</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-[85%]" />
              </div>
              <p className="text-[10px] text-slate-400">85% of global capacity utilized</p>
            </div>

            {/* Professional Tier */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-white">Professional Tier</span>
                <span className="text-blue-600 dark:text-blue-400">Unlimited*</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[42%]" />
              </div>
              <p className="text-[10px] text-slate-400">42% of global capacity utilized</p>
            </div>

            {/* RATE LIMITS Box */}
            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-2">
                RATE LIMITS
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium">Requests/Min</span>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">60 RPM</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium">Concurrency</span>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">10 slots</p>
                </div>
              </div>
            </div>

          </div>

          <Button variant="outline" className="w-full rounded-2xl border-slate-300 dark:border-slate-800 text-xs font-extrabold py-2.5">
            Edit Tier Policies
          </Button>
        </Card>

      </div>

      {/* BOTTOM SECTION: Global Prompt Editor */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Global Prompt Editor
            </h3>
            
            <div className="flex items-center bg-slate-100 dark:bg-[#121522] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {(['parser', 'cover', 'voice'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePromptTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activePromptTab === tab
                      ? 'bg-black dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'parser' ? 'Resume Parser' : tab === 'cover' ? 'Cover Letter Studio' : 'Voice Interviewer'}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Last edited 2h ago by Sarah K.
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <Textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={5}
            className="rounded-2xl border-slate-800 bg-[#090b13] text-slate-200 text-xs font-mono p-4"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> API: Healthy
              </span>
              <span>P95 Latency: 1420ms</span>
              <span>Error Rate: 0.02%</span>
            </div>

            <span>Cluster: AWS-US-EAST-1</span>
          </div>
        </div>
      </Card>

    </div>
  );
}
