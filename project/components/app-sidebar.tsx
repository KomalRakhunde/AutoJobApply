'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/auth-slice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Target,
  Briefcase,
  KanbanSquare,
  FileText,
  MessageSquare,
  Compass,
  Mail,
  Bot,
  Crown,
  Settings,
  LogOut,
  Sparkles,
  Zap,
  X,
  ChevronRight,
  ChevronLeft,
  User as UserIcon,
} from 'lucide-react';

const coreWorkflowLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resume', label: 'Resume & ATS Analysis', icon: Target },
  { href: '/jobs', label: 'Job Search & Matching', icon: Briefcase },
  { href: '/applications', label: 'Application Tracker', icon: KanbanSquare },
];

const exploreAiToolsLinks = [
  { href: '/auto-apply', label: 'Auto-Apply Engine', icon: Bot, badge: 'AUTO' },
  { href: '/cover-letter', label: 'Cover Letter Generator', icon: FileText },
  { href: '/interview-prep', label: 'Interview Prep', icon: MessageSquare },
  { href: '/career-coach', label: 'AI Career Coach', icon: Compass, badge: 'NEW' },
  { href: '/email-sync', label: 'Email Inbox AI', icon: Mail },
  { href: '/pricing', label: 'Plans & Pricing', icon: Crown },
];

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
}: {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const username = user?.email ? user.email.split('@')[0] : 'Komal.dharma';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <aside
      className={`h-full flex flex-col border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-60'
      } ${
        isOpenMobile ? 'fixed inset-y-0 left-0 z-50 translate-x-0 w-64' : 'translate-x-0'
      }`}
    >
      {/* Top Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800/60 pt-safe">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          {(!isCollapsed || isOpenMobile) && (
            <div className="flex flex-col min-w-0 transition-opacity">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                ApplyAI
              </span>
              <span className="text-[10px] font-medium text-slate-400 truncate">
                Career Automation
              </span>
            </div>
          )}
        </Link>
        
        {/* Toggle Collapse Button (Desktop) */}
        {onToggleCollapse && (!isOpenMobile) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6 no-scrollbar">
        {/* Core Workflow Section */}
        <div className="space-y-1">
          {(!isCollapsed || isOpenMobile) && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Core Workflow
            </p>
          )}
          {coreWorkflowLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed && !isOpenMobile ? item.label : undefined}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  {(!isCollapsed || isOpenMobile) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {isActive && (!isCollapsed || isOpenMobile) && (
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Explore AI Tools Section */}
        <div className="space-y-1">
          {(!isCollapsed || isOpenMobile) && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              AI Tools
            </p>
          )}
          {exploreAiToolsLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed && !isOpenMobile ? item.label : undefined}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  {(!isCollapsed || isOpenMobile) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {item.badge && (!isCollapsed || isOpenMobile) && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide shrink-0 ${
                      item.badge === 'AUTO'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Pro Plan Card */}
        {(!isCollapsed || isOpenMobile) && (
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 p-3.5 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-purple-950/20">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Zap className="h-4 w-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Pro Plan Active</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
              Unlimited AI submissions & ATS resume audits enabled.
            </p>
            <Link
              href="/pricing"
              onClick={onCloseMobile}
              className="mt-2.5 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Manage Plan</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Profile Section */}
      <div className="border-t border-slate-100 p-2.5 dark:border-slate-800/60 pb-safe">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
          <Link
            href="/profile"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
            title={username}
          >
            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shrink-0">
              <AvatarFallback className="bg-indigo-600 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            {(!isCollapsed || isOpenMobile) && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                  {username}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {user?.email ?? 'komal.dharma@applyai.com'}
                </p>
              </div>
            )}
          </Link>
          {(!isCollapsed || isOpenMobile) && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Link href="/profile" onClick={onCloseMobile}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-7 w-7 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        {(!isCollapsed || isOpenMobile) && (
          <div className="px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500">
              Designed & Developed by <span className="font-bold text-slate-700 dark:text-slate-300">Komal Rakhunde</span> © 2026
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
