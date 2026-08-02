'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout, setRole } from '@/lib/store/auth-slice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/lib/types';
import { getDisplayName, getUserInitials } from '@/lib/utils';
import { usePinnedFeatures } from '@/lib/hooks/use-pinned-features';
import {
  LayoutDashboard,
  Target,
  Briefcase,
  KanbanSquare,
  Zap,
  FileText,
  MessageSquare,
  Compass,
  Mail,
  Crown,
  LogOut,
  Sparkles,
  ChevronLeft,
  Settings,
  ShieldCheck,
  Building2,
  Users,
  ShieldAlert,
  PlusCircle,
  UploadCloud,
  Scale,
  Bot,
  Mic,
  Layers,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
  Pin,
  PinOff,
  X,
  Video,
  Share2,
  DollarSign,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const roleBadges: Record<UserRole, { label: string; color: string }> = {
  student: { label: 'Student', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  recruiter: { label: 'Recruiter', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  admin: { label: 'Admin', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  super_admin: { label: 'Super Admin', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
};

const getRoleNavigation = (role: UserRole = 'student'): { core: NavItem[]; secondary: NavItem[] } => {
  if (role === 'recruiter') {
    return {
      core: [
        {href: '/dashboard/recruiter', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/recruiter?tab=candidates', label: 'Candidate Intake', icon: Users, badge: 'ATS' },
        { href: '/dashboard/recruiter?tab=interviews', label: 'Voice Screening', icon: Mic, badge: 'VOICE' },
        { href: '/dashboard/recruiter?tab=offers', label: 'Offer Letters', icon: FileText, badge: 'OFFERS' },
        { href: '/dashboard/recruiter?tab=jobs', label: 'Job Postings', icon: Briefcase, badge: 'JOBS' },
        { href: '/dashboard/recruiter?tab=analytics', label: 'Hiring Analytics', icon: Target, badge: 'ANALYTICS' },
        { href: '/sourcing', label: 'AI Sourcing Agent', icon: Bot, badge: 'AGENT' },
      ],
      secondary: [
        { href: '/profile', label: 'Company Profile', icon: Building2 },
      ],
    };
  }

  if (role === 'admin') {
    return {
      core: [
        { href: '/dashboard/admin', label: 'Admin Console', icon: ShieldCheck },
        { href: '/admin/performance', label: 'Team Performance', icon: Users, badge: 'TEAM' },
        { href: '/admin/analytics', label: 'Pipeline & Analytics', icon: TrendingUp, badge: 'HIRING' },
        { href: '/admin/operations', label: 'Operations & SLA', icon: AlertTriangle, badge: 'SLA' },
        { href: '/admin/reports', label: 'Approvals & Reports', icon: FileSpreadsheet, badge: 'EXEC' },
      ],
      secondary: [
        { href: '/jobs', label: 'Job Listing Moderation', icon: Briefcase },
        { href: '/profile', label: 'User Directory', icon: Users },
      ],
    };
  }

  if (role === 'super_admin') {
    return {
      core: [
        { href: '/dashboard/super-admin', label: 'Super Admin Control', icon: ShieldAlert },
        { href: '/jobs', label: 'Global Job Postings', icon: Briefcase },
      ],
      secondary: [
        { href: '/profile', label: 'System Users & Roles', icon: Users },
      ],
    };
  }

  // Default Student Role Navigation
  return {
    core: [
      { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/resume', label: 'Resume & ATS Analysis', icon: Target },
      { href: '/jobs', label: 'Job Search & Matching', icon: Briefcase },
      { href: '/applications', label: 'Application Tracker', icon: KanbanSquare },
    ],
    secondary: [
      { href: '/auto-apply', label: 'Auto-Apply Engine', icon: Zap, badge: 'AUTO' },
      { href: '/cover-letter', label: 'Cover Letter Generator', icon: FileText },
      { href: '/video-resume', label: 'AI Video Resume Studio', icon: Video, badge: 'VIDEO' },
      { href: '/linkedin-posts', label: 'LinkedIn Post AI', icon: Share2 },
      { href: '/networking', label: 'AI Networking Assistant', icon: Compass },
      { href: '/negotiation', label: 'Salary Negotiation AI', icon: DollarSign },
      { href: '/company-culture', label: 'Company Culture Insights', icon: Building2 },
      { href: '/referrals', label: 'Referral Finder AI', icon: Users },
      { href: '/interview-prep', label: 'Interview Studio', icon: MessageSquare },
      { href: '/career-roadmap', label: 'Career Roadmap', icon: TrendingUp, badge: 'NEW' },
      { href: '/email-sync', label: 'Email Inbox AI', icon: Mail },
      { href: '/pricing', label: 'Plans & Pricing', icon: Crown },
    ],
  };
};

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

  const role: UserRole = user?.role ?? 'student';
  const roleBadge = roleBadges[role] || roleBadges.student;
  const navigation = getRoleNavigation(role);

  const [currentTab, setCurrentTab] = useState<string>('overview');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCurrentTab(params.get('tab') || 'overview');
    }
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const username = getDisplayName(user);
  const initials = getUserInitials(username);

  const { isPinned, togglePin } = usePinnedFeatures();

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
        <Link href={`/dashboard/${role}`} className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          {(!isCollapsed || isOpenMobile) && (
            <div className="flex flex-col min-w-0 transition-opacity">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                ApplyAI
              </span>
              <span className="text-[10px] font-medium text-slate-400 truncate">
                Multi-Role Platform
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        )}

        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="flex lg:hidden h-9 w-9 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl touch-target"
            title="Close Menu"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {/* Recruiter Top Priority Quick Actions */}
        {role === 'recruiter' && (
          <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
            {(!isCollapsed || isOpenMobile) && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                High Priority Actions
              </p>
            )}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-create-job'));
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Post New Job' : undefined}
            >
              <PlusCircle className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Post New Job</span>}
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-bulk-upload'));
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Bulk Upload Resumes' : undefined}
            >
              <UploadCloud className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Bulk Upload Resumes</span>}
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-ai-jd'));
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50 dark:hover:text-purple-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'AI JD Generator' : undefined}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">AI JD Generator</span>}
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-compare'));
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Compare Candidates' : undefined}
            >
              <Scale className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Compare Candidates</span>}
            </button>
          </div>
        )}

        {/* Admin Top Priority Quick Actions */}
        {role === 'admin' && (
          <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
            {(!isCollapsed || isOpenMobile) && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                Admin Quick Actions
              </p>
            )}
            <button
              onClick={() => {
                window.location.href = '/admin/reports';
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Review Approvals' : undefined}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Review Approvals</span>}
            </button>

            <button
              onClick={() => {
                window.location.href = '/admin/performance';
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Rebalance Workload' : undefined}
            >
              <Sliders className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Rebalance Workload</span>}
            </button>

            <button
              onClick={() => {
                window.location.href = '/admin/operations';
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50 dark:hover:text-amber-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Check SLA Warnings' : undefined}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Check SLA Warnings</span>}
            </button>

            <button
              onClick={() => {
                window.location.href = '/admin/reports';
                onCloseMobile?.();
              }}
              className="w-full group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50 dark:hover:text-purple-300 border border-slate-200/80 dark:border-slate-800 transition-all text-left shadow-2xs"
              title={isCollapsed ? 'Export Reports' : undefined}
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
              {(!isCollapsed || isOpenMobile) && <span className="truncate flex-1 font-bold">Export Reports</span>}
            </button>
          </div>
        )}

        {/* Core Navigation */}
        <div className="space-y-1">
          {(!isCollapsed || isOpenMobile) && (
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
              <span>{role === 'recruiter' ? 'Recruiter Workflow' : role === 'admin' ? 'Admin Management' : role === 'super_admin' ? 'System Controls' : 'Core Workflow'}</span>
            </p>
          )}
          {navigation.core.map((item) => {
            const Icon = item.icon;

            let isActive = false;
            if (item.href.includes('?tab=')) {
              const itemTab = item.href.split('?tab=')[1];
              isActive = pathname === '/dashboard/recruiter' && currentTab === itemTab;
            } else if (item.href === '/dashboard/recruiter') {
              isActive = pathname === '/dashboard/recruiter' && (currentTab === 'overview' || !currentTab);
            } else {
              isActive = pathname === item.href || (item.href.startsWith('/dashboard') && pathname === item.href);
            }

            const itemIsPinned = isPinned(item.href);
            const isPinnable = role === 'student' && item.href !== '/dashboard/student';

            return (
              <div key={item.href} className="relative group/nav font-medium">
                <Link
                  href={item.href}
                  onClick={() => {
                    if (item.href.includes('?tab=')) {
                      setCurrentTab(item.href.split('?tab=')[1]);
                    } else if (item.href === '/dashboard/recruiter') {
                      setCurrentTab('overview');
                    }
                    onCloseMobile?.();
                  }}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  {(!isCollapsed || isOpenMobile) && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {(!isCollapsed || isOpenMobile) && item.badge && !itemIsPinned && (
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>

                {isPinnable && (!isCollapsed || isOpenMobile) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePin(item.href);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition-all ${
                      itemIsPinned
                        ? 'text-amber-500 opacity-100 hover:text-amber-600'
                        : 'text-slate-400 opacity-0 group-hover/nav:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                    title={itemIsPinned ? 'Pinned to Dashboard (Click to unpin)' : 'Pin to Dashboard'}
                  >
                    <Pin className={`h-3.5 w-3.5 ${itemIsPinned ? 'fill-amber-500' : ''}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Secondary Utilities */}
        <div className="space-y-1">
          {(!isCollapsed || isOpenMobile) && (
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {role === 'recruiter' ? 'Recruiter Utilities' : role === 'admin' ? 'Admin Tools' : role === 'super_admin' ? 'Platform Utilities' : 'Explore AI Tools'}
            </p>
          )}
          {navigation.secondary.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const itemIsPinned = isPinned(item.href);
            const isPinnable = role === 'student' && item.href !== '/pricing';

            return (
              <div key={item.href} className="relative group/nav font-medium">
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  {(!isCollapsed || isOpenMobile) && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {(!isCollapsed || isOpenMobile) && item.badge && !itemIsPinned && (
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>

                {isPinnable && (!isCollapsed || isOpenMobile) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePin(item.href);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition-all ${
                      itemIsPinned
                        ? 'text-amber-500 opacity-100 hover:text-amber-600'
                        : 'text-slate-400 opacity-0 group-hover/nav:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                    title={itemIsPinned ? 'Pinned to Dashboard (Click to unpin)' : 'Pin to Dashboard'}
                  >
                    <Pin className={`h-3.5 w-3.5 ${itemIsPinned ? 'fill-amber-500' : ''}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pro Plan Status Card for Student Role */}
        {role === 'student' && (!isCollapsed || isOpenMobile) && (
          <div className="pt-2">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-400" />
                <span>PRO PLAN ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Unlimited AI submissions & ATS resume audits enabled.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile Badge & Author Credit */}
      <div className="border-t border-slate-100 p-3 dark:border-slate-800/60">
        <div className="flex items-center justify-between gap-2">
          <Link href="/profile" onClick={onCloseMobile} className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs">
              {initials}
            </div>
            {(!isCollapsed || isOpenMobile) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {username}
                  </p>
                  <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
                <p className="truncate text-[10px] text-slate-400">
                  {user?.email ?? 'komal.dharma@applyai.com'}
                </p>
              </div>
            )}
          </Link>
          {(!isCollapsed || isOpenMobile) && (
            <div className="flex items-center gap-0.5 shrink-0">
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
          <div className="px-1 pb-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center mt-2">
            <p className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500">
              Designed & Developed by <span className="font-bold text-slate-700 dark:text-slate-300">Komal Rakhunde</span> © 2026
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
