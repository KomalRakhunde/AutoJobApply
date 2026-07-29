'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Sparkles, Zap, Shield, Crown, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PricingPage() {
  const { toast } = useToast();
  const [yearly, setYearly] = useState(false);

  const handleSelectPlan = (planName: string) => {
    toast({
      title: `${planName} Selected`,
      description: `Redirecting to secure checkout for ${planName} plan...`,
    });
  };

  return (
    <PageShell
      title="Subscription Plans & Tier Pricing"
      subtitle="Choose the plan that fits your career acceleration goals. Upgrade anytime."
    >
      <div className="space-y-8">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${!yearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
            Monthly Billing
          </span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={`text-sm font-medium ${yearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
            Annual Billing
          </span>
          <Badge className="bg-emerald-500 text-white font-semibold">SAVE 20%</Badge>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Free Tier */}
          <Card className="flex flex-col justify-between border-border transition-all hover:shadow-lg">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Free Tier</CardTitle>
                  <Badge variant="outline">Starter</Badge>
                </div>
                <CardDescription>Essential job search tools for freshers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-xs text-muted-foreground"> / forever free</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>20 applications per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Basic ATS Resume Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Standard Cover Letter Generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Basic Job Search & Tracker</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => handleSelectPlan('Free Tier')}>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier (Popular) */}
          <Card className="relative flex flex-col justify-between border-2 border-primary bg-primary/5 shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-brand-gradient text-white px-3 py-1 text-xs font-semibold shadow-md">
                MOST POPULAR
              </Badge>
            </div>

            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-1.5">
                    <Crown className="h-5 w-5 text-amber-500" /> Pro Plan
                  </CardTitle>
                  <Badge className="bg-primary">Pro</Badge>
                </div>
                <CardDescription>Full AI automation suite for active job seekers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{yearly ? '$19' : '$24'}</span>
                  <span className="text-xs text-muted-foreground"> / month {yearly ? '(billed annually)' : ''}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Unlimited Auto-Apply Submissions</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Smart Rules Filter (Salary, Remote, Tech Stack)</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>AI Career Coach & Skill Gap Analyzer</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Automated Gmail Sync & Calendar Invites</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Advanced Analytics & Success Ratio Dashboard</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="pt-4">
              <Button className="w-full gap-2 shadow-lg" onClick={() => handleSelectPlan('Pro Plan')}>
                <Sparkles className="h-4 w-4" /> Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="flex flex-col justify-between border-border transition-all hover:shadow-lg">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-1.5">
                    <Building2 className="h-5 w-5 text-violet-500" /> Enterprise
                  </CardTitle>
                  <Badge variant="secondary">Recruiters</Badge>
                </div>
                <CardDescription>Multi-candidate management & API access for agencies</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{yearly ? '$79' : '$99'}</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>All Pro Features Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Multi-Candidate Profile Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Bulk Application Engine & API Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Dedicated Support & Custom Integrations</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => handleSelectPlan('Enterprise Plan')}>
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
