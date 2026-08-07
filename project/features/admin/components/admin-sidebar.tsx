'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Zap,
  Sliders,
  Terminal,
  Settings,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard (Command Center)', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Auto-Apply Queue & Proxy Matrix', href: '/admin/auto-apply', icon: Zap },
  { label: 'LLM Provider & Engine Settings', href: '/admin/settings/llm', icon: Sliders },
  { label: 'Real-Time System Logs', href: '/admin/operations', icon: Terminal },
];

export function AdminSidebar({ className = '' }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 h-full shrink-0 border-r border-slate-800/80 bg-[#0b0f19] flex flex-col justify-between p-4 font-sans text-xs select-none ${className}`}>
      
      {/* Brand Header & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-white tracking-tight leading-none">
                CareerSync
              </span>
              <span className="text-xs font-bold text-blue-400">ApplyAI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              PROFESSIONAL SUITE
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
            ADMIN NAVIGATION
          </p>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard/admin' && (pathname === '/dashboard/admin' || pathname === '/admin')) ||
              (item.href !== '/dashboard/admin' && item.href !== '/admin' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white rounded-lg shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">
                    {item.label}
                  </span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80 shrink-0" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
              SYSTEM ADMIN
            </Badge>
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <p className="text-[11px] font-bold text-slate-200 leading-tight">
            CareerSync Pro v4.2.1
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] py-1.5 h-8 rounded-xl shadow-xs">
            Upgrade to Pro
          </Button>
        </div>

        <div className="flex items-center justify-between px-2 pt-1 text-slate-400 font-bold">
          <Link href="/admin/settings" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </Link>
        </div>
      </div>

    </aside>
  );
}
