'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout, setRole } from '@/lib/store/auth-slice';
import type { UserRole } from '@/lib/types';
import { getDisplayName, getUserInitials } from '@/lib/utils';
import {
  Sparkles,
  Search,
  Zap,
  User as UserIcon,
  LogOut,
  PanelLeft,
  Briefcase,
  Target,
  KanbanSquare,
  FileText,
  MessageSquare,
  Compass,
  Mail,
  ArrowRight,
  X,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Video,
  Share2,
  DollarSign,
  Building2,
  Users,
} from 'lucide-react';

const searchableItems = [
  { label: 'Job Search & Matching', href: '/jobs', type: 'Feature', icon: Briefcase },
  { label: 'Resume & ATS Analysis', href: '/resume', type: 'Tool', icon: Target },
  { label: 'Application Tracker', href: '/applications', type: 'Workflow', icon: KanbanSquare },
  { label: 'Auto-Apply Engine', href: '/auto-apply', type: 'Automation', icon: Zap },
  { label: 'Cover Letter Generator', href: '/cover-letter', type: 'AI Tool', icon: FileText },
  { label: 'AI Video Resume Studio', href: '/video-resume', type: 'AI Media', icon: Video },
  { label: 'LinkedIn Post AI', href: '/linkedin-posts', type: 'AI Social', icon: Share2 },
  { label: 'AI Networking Assistant', href: '/networking', type: 'Outreach', icon: Compass },
  { label: 'Salary Negotiation AI', href: '/negotiation', type: 'AI Finance', icon: DollarSign },
  { label: 'Company Culture Insights', href: '/company-culture', type: 'Culture', icon: Building2 },
  { label: 'Referral Finder AI', href: '/referrals', type: 'Referral', icon: Users },
  { label: 'Interview Studio', href: '/interview-prep', type: 'AI Tool', icon: MessageSquare },
  { label: 'Career Roadmap', href: '/career-roadmap', type: 'Roadmap', icon: TrendingUp },
  { label: 'Email Inbox AI', href: '/email-sync', type: 'Sync', icon: Mail },
];

const roleBadges: Record<UserRole, { label: string; color: string }> = {
  student: { label: 'Student', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  recruiter: { label: 'Recruiter', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  admin: { label: 'Admin', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  super_admin: { label: 'Super Admin', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
};

export function PageShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const role: UserRole = user?.role ?? 'student';
  const roleBadge = roleBadges[role] || roleBadges.student;

  const username = getDisplayName(user);
  const initials = getUserInitials(username);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    dispatch(setRole(newRole));
    router.push(`/dashboard/${newRole}`);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const filteredResults = searchableItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0a0d18] text-slate-900 dark:text-slate-100">
        {/* Sticky Desktop Collapsible Left Sidebar */}
        <div className="sticky top-0 h-full z-30 shrink-0 hidden lg:block border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0a0d18] overflow-y-auto">
          <AppSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Slide-Out Drawer Overlay */}
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpenMobile(false)}
            />
            <AppSidebar
              isOpenMobile={isOpenMobile}
              onCloseMobile={() => setIsOpenMobile(false)}
            />
          </div>
        )}

        {/* Main Application Column */}
        <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
          {/* Sticky Top Clean Header Bar */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0a0d18]/95 sm:px-6 lg:px-8 xl:px-10 pt-safe shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Toggle Sidebar Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpenMobile(true);
                  } else {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }
                }}
                className="h-10 w-10 text-slate-600 hover:text-slate-900 dark:text-slate-300 shrink-0 touch-target"
                aria-label="Toggle sidebar menu"
                title="Toggle Sidebar"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>

              {/* Functional Search Bar with Instant Command Palette */}
              <div ref={searchRef} className="relative max-w-md w-full min-w-0 flex-1">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search jobs, tools, ⌘K..."
                    className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/90 pl-9 pr-10 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:bg-slate-800"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden select-none rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 sm:inline-block">
                      ⌘K
                    </kbd>
                  )}
                </form>

                {/* Instant Search Results Dropdown */}
                {searchOpen && (
                  <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-scale-in w-[90vw] sm:w-full max-w-md">
                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {searchQuery ? 'Search Results' : 'Quick Access Navigation'}
                    </p>
                    <div className="space-y-1">
                      {filteredResults.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400">
                          No matching tools found. Press Enter to search job listings.
                        </div>
                      ) : (
                        filteredResults.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="h-4 w-4 text-slate-400" />
                                <span>{item.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 dark:bg-slate-800">
                                  {item.type}
                                </span>
                                <ArrowRight className="h-3 w-3 text-slate-400" />
                              </div>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Header Right Actions & Profile */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-flex items-center text-xs font-bold text-slate-700 dark:text-slate-200">
                Welcome, <span className="text-indigo-600 dark:text-indigo-400 ml-1 font-extrabold">{username}</span> 👋
              </span>

              {/* Role Pill Badge */}
              <span className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${roleBadge.color}`}>
                {roleBadge.label} Portal
              </span>

              {actions}
              <ThemeToggle />

              {/* User Avatar Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-0.5 ring-offset-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                      <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-xs font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
                        {username}
                      </p>
                      <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {user?.email ?? 'komal.dharma@applyai.com'}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Switch Role Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer text-xs font-semibold">
                      <Briefcase className="mr-2 h-4 w-4 text-indigo-500" />
                      Switch Portal Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48 rounded-xl">
                      <DropdownMenuItem onClick={() => handleSwitchRole('student')} className="cursor-pointer text-xs">
                        <GraduationCap className="mr-2 h-4 w-4 text-indigo-500" />
                        Student / Job Seeker
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSwitchRole('recruiter')} className="cursor-pointer text-xs">
                        <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
                        Recruiter / Employer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSwitchRole('admin')} className="cursor-pointer text-xs">
                        <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                        Admin Console
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSwitchRole('super_admin')} className="cursor-pointer text-xs">
                        <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                        Super Admin Control
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer text-xs font-medium">
                      <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-rose-600 focus:text-rose-600 dark:text-rose-400 text-xs font-semibold"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Body Content Container - Exclusive Scroll Container */}
          <main className="flex-1 h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 pb-safe w-full space-y-6">
            <div className="animate-fade-in-up flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
