'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Sparkles, Crown, Building2, Menu, X, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PricingPage() {
  const { toast } = useToast();
  const [yearly, setYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectPlan = (planName: string) => {
    toast({
      title: `${planName} Selected`,
      description: `Redirecting to secure checkout for ${planName} plan...`,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-extrabold tracking-tight text-blue-400">
                ApplyAI
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
              <Link href="/pricing" className="text-blue-400 font-bold transition-colors">Plans</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Details</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 h-9 rounded-xl shadow-lg shadow-blue-500/20" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 px-2 border-t border-slate-800 mt-3 space-y-2 bg-slate-900 animate-in slide-in-from-top-2">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold rounded-lg text-blue-400 bg-blue-950/50"
            >
              Plans & Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Contact Details
            </Link>
          </div>
        )}
      </header>

      {/* BALANCED MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-auto py-6 sm:py-10 space-y-8 relative z-10">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Transparent Pricing For Every Candidate & Enterprise</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Flexible Plans for Your Career Growth
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Choose the plan that fits your job search velocity. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-bold ${!yearly ? 'text-white' : 'text-slate-500'}`}>
              Monthly Billing
            </span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={`text-xs font-bold ${yearly ? 'text-white' : 'text-slate-500'}`}>
              Annual Billing
            </span>
            <Badge className="bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5">SAVE 20%</Badge>
          </div>
        </div>

        {/* Pricing Cards Grid (Equal Heights) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
          {/* Free Tier */}
          <Card className="flex flex-col justify-between border-slate-800 bg-slate-900/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700">
            <div className="space-y-4">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-bold text-white">Free Tier</CardTitle>
                  <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">Starter</Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 pt-1">
                  Essential job search tools for candidates
                </CardDescription>
                <div className="pt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-500 font-medium"> / forever free</span>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white">20 applications/day</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Basic AI Assistant</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-0 pt-6">
              <Button variant="outline" className="w-full rounded-xl h-11 min-h-[44px] text-xs font-bold border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800" onClick={() => handleSelectPlan('Free Tier')}>
                Get Started Free
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier (Popular) */}
          <Card className="relative flex flex-col justify-between border-2 border-blue-500 bg-slate-900/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl md:scale-[1.02]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-3 py-1 text-xs font-extrabold shadow-lg tracking-wider uppercase">
                MOST POPULAR
              </Badge>
            </div>

            <div className="space-y-4">
              <CardHeader className="p-0 pt-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-1.5 text-blue-400">
                    <Crown className="h-5 w-5 text-amber-400 shrink-0" /> Pro Accelerator
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs">Pro</Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 pt-1">
                  Full automation suite for active job seekers
                </CardDescription>
                <div className="pt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {yearly ? '$19' : '$29'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-bold text-white">Unlimited Applications</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-bold text-white">Unlimited Resumes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Interview AI Studio</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Application Analytics & Insights</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-0 pt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-11 min-h-[44px] text-xs shadow-lg shadow-blue-600/30" onClick={() => handleSelectPlan('Pro Accelerator')}>
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise / Recruiter Tier */}
          <Card className="flex flex-col justify-between border-slate-800 bg-slate-900/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700">
            <div className="space-y-4">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-1.5 text-white">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" /> Enterprise
                  </CardTitle>
                  <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">Recruiters</Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 pt-1">
                  For staffing agencies & recruiting teams
                </CardDescription>
                <div className="pt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {yearly ? '$99' : '$149'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / seat / month</span>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white">Recruiters Multi-Seat Management</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Bulk Applications & Parsing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Candidate Management System</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Full REST API Access</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-0 pt-6">
              <Button variant="outline" className="w-full rounded-xl h-11 min-h-[44px] text-xs font-bold border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800" onClick={() => handleSelectPlan('Enterprise')}>
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl py-4 px-4 sm:px-8 text-[11px] text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-300">ApplyAI Enterprise</span> © 2026 ApplyAI Enterprise. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <Link href="/pricing" className="text-blue-400 font-bold">Plans</Link>
            <Link href="/contact" className="hover:text-blue-400">Contact Details</Link>
            <Link href="/#features" className="hover:text-blue-400">Privacy Policy</Link>
            <Link href="/#features" className="hover:text-blue-400">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
