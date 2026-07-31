'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Tag,
  Plus,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Download,
  Percent,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  user: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  amount: string;
  gateway: 'Stripe' | 'Razorpay';
  status: 'Succeeded' | 'Failed' | 'Refunded';
  date: string;
}

const initialTransactions: Transaction[] = [
  { id: 'tx_10928', user: 'Jordan Miles', plan: 'Pro', amount: '$29.00', gateway: 'Stripe', status: 'Succeeded', date: 'Just now' },
  { id: 'tx_10927', user: 'Sarah Jenkins', plan: 'Enterprise', amount: '$299.00', gateway: 'Stripe', status: 'Succeeded', date: '12 mins ago' },
  { id: 'tx_10926', user: 'Marcus Vane', plan: 'Pro', amount: '$29.00', gateway: 'Razorpay', status: 'Refunded', date: '1 hr ago' },
  { id: 'tx_10925', user: 'Elena Rodriguez', plan: 'Pro', amount: '$29.00', gateway: 'Stripe', status: 'Failed', date: '3 hrs ago' },
  { id: 'tx_10924', user: 'David Kim', plan: 'Pro', amount: '$29.00', gateway: 'Stripe', status: 'Succeeded', date: '5 hrs ago' },
];

const activePromos = [
  { code: 'STUDENT50', discount: '50% OFF', category: 'Student Pass', uses: 342, status: 'Active' },
  { code: 'SUMMER2026', discount: '20% OFF', category: 'Seasonal Promo', uses: 890, status: 'Active' },
  { code: 'CAREERPLUS', discount: '1 Month Free', category: 'Trial Extension', uses: 120, status: 'Active' },
];

export default function SubscriptionRevenueManagement() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoDiscountInput, setPromoDiscountInput] = useState('');
  const [promosList, setPromosList] = useState(activePromos);

  const handleCreatePromo = () => {
    if (!promoCodeInput.trim()) return;
    setPromosList((prev) => [
      { code: promoCodeInput.toUpperCase(), discount: promoDiscountInput || '20% OFF', category: 'Custom Discount', uses: 0, status: 'Active' },
      ...prev,
    ]);
    setPromoCodeInput('');
    setPromoDiscountInput('');
    toast({
      title: '🎟️ Promo Code Created',
      description: `Generated new discount pass ${promoCodeInput.toUpperCase()}.`,
    });
  };

  const handleRefund = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'Refunded' } : t))
    );
    toast({
      title: '💸 Refund Processed',
      description: `Dispatched refund request for transaction ${txId}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Subscription & Revenue Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pricing tiers, Stripe/Razorpay payment hub, and promo discount controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-2">
            <Download className="h-4 w-4" />
            <span>Export Financial Log</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
          <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Monthly Recurring Revenue</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">$124,900</h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+8.4%</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
          <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Active Paid Subscriptions</span>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">3,842</h3>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
          <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Webhook Success Rate</span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">99.8%</h3>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
          <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Redeemed Promos</span>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">1,352</h3>
        </Card>
      </div>

      {/* PLAN & TIER MANAGEMENT CARDS */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Plan & Tier Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Free Tier</h4>
              <Badge variant="outline">Default</Badge>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">$0 <span className="text-xs text-slate-400 font-normal">/ mo</span></p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li>• 5 Resumes Parsed / Mo</li>
              <li>• 10 Auto-Apply Queue Slots</li>
              <li>• Standard LLM Speed</li>
            </ul>
            <Button variant="outline" className="w-full text-xs font-extrabold rounded-xl">Edit Limits</Button>
          </Card>

          <Card className="rounded-2xl border-2 border-blue-500 bg-white dark:bg-[#0b0f19] p-5 space-y-4 shadow-xs relative">
            <Badge className="absolute top-3 right-3 bg-blue-600 text-white font-extrabold text-[10px]">MOST POPULAR</Badge>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Pro Tier</h4>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">$29 <span className="text-xs text-slate-400 font-normal">/ mo</span></p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li>• Unlimited Resumes & ATS Scoring</li>
              <li>• 500 Auto-Apply Queue Slots</li>
              <li>• Priority GPT-4o & Claude 3.5 Routing</li>
            </ul>
            <Button className="w-full bg-blue-600 text-white text-xs font-extrabold rounded-xl">Edit Tier Rules</Button>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Enterprise</h4>
              <Badge variant="outline">Custom</Badge>
            </div>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">$299 <span className="text-xs text-slate-400 font-normal">/ mo</span></p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li>• Bulk Candidate Uploads (5,000+)</li>
              <li>• Dedicated Scraper Nodes</li>
              <li>• SLA 99.9% + Direct Support</li>
            </ul>
            <Button variant="outline" className="w-full text-xs font-extrabold rounded-xl">Configure Custom Tier</Button>
          </Card>
        </div>
      </div>

      {/* BILLING & PAYMENT HUB TABLE */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Live Transaction & Webhook Log</h3>
            <p className="text-xs text-slate-400">Stripe & Razorpay payment charges</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{tx.id}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">{tx.user}</td>
                  <td className="py-3 px-4"><Badge variant="outline">{tx.plan}</Badge></td>
                  <td className="py-3 px-4 font-black">{tx.amount}</td>
                  <td className="py-3 px-4 font-semibold">{tx.gateway}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      tx.status === 'Succeeded' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      tx.status === 'Failed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                  <td className="py-3 px-4 text-right">
                    {tx.status === 'Succeeded' && (
                      <Button onClick={() => handleRefund(tx.id)} variant="ghost" size="sm" className="text-amber-600 font-bold text-xs">
                        Issue Refund
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PROMO CODE & DISCOUNT ENGINE */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Promo Code & Discount Generator</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="PROMO CODE (e.g. FALL2026)"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0f111a]"
          />
          <Input
            placeholder="Discount Value (e.g. 30% OFF)"
            value={promoDiscountInput}
            onChange={(e) => setPromoDiscountInput(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0f111a]"
          />
          <Button onClick={handleCreatePromo} className="bg-black dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs px-6 rounded-xl shrink-0">
            Generate Code
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {promosList.map((p, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-black text-slate-900 dark:text-white tracking-wider">{p.code}</p>
                <p className="text-[11px] text-slate-400 font-medium">{p.category} • {p.discount}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold">{p.uses} uses</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
