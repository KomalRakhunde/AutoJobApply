'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  CheckCircle2,
  Upload,
  Link2,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  Bot,
  FileText,
  Globe,
  Loader2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDisplayName } from '@/lib/utils';

export function AiSetupWizard() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(2);
  const [masterResumeName, setMasterResumeName] = useState<string | null>(null);
  const [connectedPortals, setConnectedPortals] = useState({
    linkedIn: true,
    naukri: true,
    indeed: true,
    glassdoor: true,
  });

  const [preferences, setPreferences] = useState({
    minSalary: '$100k',
    targetRole: 'Software Engineer',
    location: 'Remote',
    workMode: 'Remote',
  });

  const [isConnectingPortal, setIsConnectingPortal] = useState<string | null>(null);
  const [autopilotActive, setAutopilotActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMasterResumeName(file.name);
      toast({
        title: '✅ Master Resume Uploaded',
        description: `Successfully stored "${file.name}" for AI tailoring.`,
      });
    }
  };

  const handleConnectPortal = (portalName: string, key: keyof typeof connectedPortals) => {
    setIsConnectingPortal(portalName);
    setTimeout(() => {
      setConnectedPortals((prev) => ({ ...prev, [key]: true }));
      setIsConnectingPortal(null);
      toast({
        title: `✅ ${portalName} Connected`,
        description: `Linked ${portalName} account for automated job applications.`,
      });
    }, 800);
  };

  const toggleAutopilot = () => {
    const nextState = !autopilotActive;
    setAutopilotActive(nextState);
    toast({
      title: nextState ? '⚡ AI Autopilot Engaged' : '⏸️ Autopilot Paused',
      description: nextState
        ? 'AI is automatically sourcing jobs, tailoring packets, and applying on your behalf.'
        : 'Autopilot safely paused.',
    });
  };

  return (
    <Card className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#0c0e17] via-[#090b14] to-[#121626] text-white p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden font-sans">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                AI Application Autopilot Engine
              </h2>
              <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
                4-STEP SOLUTION
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Register Once → Upload Master Resume → Connect Portals → Define Preferences → AI Handles Everything Else.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            onClick={toggleAutopilot}
            className={`rounded-xl font-extrabold text-xs py-2.5 px-5 gap-2 shadow-lg transition-all ${
              autopilotActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>{autopilotActive ? 'Autopilot Active' : 'Activate AI Autopilot'}</span>
          </Button>
        </div>
      </div>

      {/* 4-Step Progress Indicator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* Step 1: Register Once */}
        <div
          onClick={() => setActiveStep(1)}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            activeStep === 1
              ? 'border-indigo-500 bg-indigo-950/40 text-white'
              : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">STEP 1</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="font-extrabold text-xs text-white">Register Once</p>
          <p className="text-[10.5px] text-slate-400 font-normal">Account &amp; Role Identity</p>
        </div>

        {/* Step 2: Upload Master Resume */}
        <div
          onClick={() => setActiveStep(2)}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            activeStep === 2
              ? 'border-indigo-500 bg-indigo-950/40 text-white'
              : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">STEP 2</span>
            {!!masterResumeName ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Upload className="h-4 w-4 text-amber-400" />}
          </div>
          <p className="font-extrabold text-xs text-white">Master Resume</p>
          <p className="text-[10.5px] text-slate-400 font-normal">PDF/DOCX AI Parser</p>
        </div>

        {/* Step 3: Connect LinkedIn/Naukri/Indeed */}
        <div
          onClick={() => setActiveStep(3)}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            activeStep === 3
              ? 'border-indigo-500 bg-indigo-950/40 text-white'
              : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">STEP 3</span>
            <Globe className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="font-extrabold text-xs text-white">Connect Portals</p>
          <p className="text-[10.5px] text-slate-400 font-normal">LinkedIn, Naukri, Indeed</p>
        </div>

        {/* Step 4: Define Preferences */}
        <div
          onClick={() => setActiveStep(4)}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            activeStep === 4
              ? 'border-indigo-500 bg-indigo-950/40 text-white'
              : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">STEP 4</span>
            <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="font-extrabold text-xs text-white">Define Preferences</p>
          <p className="text-[10.5px] text-slate-400 font-normal">Salary, Roles &amp; Filters</p>
        </div>
      </div>

      {/* Dynamic Active Step Content Drawer */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
        {activeStep === 1 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">Step 1: Account Registered &amp; Verified ({getDisplayName(user)})</h4>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Your portal role identity and security tokens are configured.
              </p>
            </div>
            <Button onClick={() => setActiveStep(2)} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 rounded-xl">
              <span>Next: Master Resume</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span>Step 2: Upload Master Resume for AI Tailoring</span>
              </h4>
              <Badge className="bg-emerald-950 text-emerald-400 text-[10px]">PARSED ACTIVE</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Your master resume provides the source experience for AI resume tailoring and cover letter generation.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 cursor-pointer rounded-xl p-4 text-center space-y-2 transition-all"
            >
              <Upload className="h-6 w-6 text-indigo-400 mx-auto" />
              {masterResumeName ? (
                <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>{masterResumeName}</span>
                </p>
              ) : (
                <p className="text-xs font-bold text-slate-200">
                  Click to select &amp; upload your Master Resume (PDF/DOCX)
                </p>
              )}
              <p className="text-[11px] text-slate-400">Click or drag PDF / DOCX file to store as master resume asset</p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveStep(3)} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 rounded-xl">
                <span>Next: Connect Portals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>Step 3: Connect Job Portals (LinkedIn / Naukri / Indeed)</span>
              </h4>
              <span className="text-xs text-emerald-400 font-bold">3/4 Portals Connected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
              {/* LinkedIn */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>LinkedIn</span>
                </div>
                {connectedPortals.linkedIn ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Button size="sm" onClick={() => handleConnectPortal('LinkedIn', 'linkedIn')} className="bg-indigo-600 text-xs px-2 py-0.5 rounded-md">
                    Connect
                  </Button>
                )}
              </div>

              {/* Naukri */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Naukri</span>
                </div>
                {connectedPortals.naukri ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Button size="sm" onClick={() => handleConnectPortal('Naukri', 'naukri')} className="bg-indigo-600 text-xs px-2 py-0.5 rounded-md">
                    Connect
                  </Button>
                )}
              </div>

              {/* Indeed */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Indeed</span>
                </div>
                {connectedPortals.indeed ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Button size="sm" onClick={() => handleConnectPortal('Indeed', 'indeed')} className="bg-indigo-600 text-xs px-2 py-0.5 rounded-md">
                    Connect
                  </Button>
                )}
              </div>

              {/* Glassdoor / Lever */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Glassdoor</span>
                </div>
                {connectedPortals.glassdoor ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Button size="sm" onClick={() => handleConnectPortal('Glassdoor', 'glassdoor')} className="bg-indigo-600 text-xs px-2 py-0.5 rounded-md">
                    Connect
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button onClick={() => setActiveStep(4)} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 rounded-xl">
                <span>Next: Preferences</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
              <span>Step 4: Define Preferences &amp; Automation Targets</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-[11px] font-bold text-slate-300">Min Base Salary</Label>
                <Input
                  value={preferences.minSalary}
                  onChange={(e) => setPreferences((p) => ({ ...p, minSalary: e.target.value }))}
                  className="rounded-xl h-9 bg-slate-900 border-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-300">Target Role Title</Label>
                <Input
                  value={preferences.targetRole}
                  onChange={(e) => setPreferences((p) => ({ ...p, targetRole: e.target.value }))}
                  className="rounded-xl h-9 bg-slate-900 border-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-300">Work Mode</Label>
                <Input
                  value={preferences.workMode}
                  onChange={(e) => setPreferences((p) => ({ ...p, workMode: e.target.value }))}
                  className="rounded-xl h-9 bg-slate-900 border-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Autopilot Ready
              </span>

              <Button
                onClick={() => {
                  setAutopilotActive(true);
                  toast({
                    title: '🚀 AI Autopilot Fully Engaged',
                    description: 'The platform is now sourcing jobs, tailoring packets, and applying automatically.',
                  });
                }}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs gap-1.5 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                <Zap className="h-3.5 w-3.5 fill-white" />
                <span>Engage AI Autopilot Now</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
