'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/auth-slice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Target,
  KanbanSquare,
  MessageSquare,
  User as UserIcon,
  Bot,
  Compass,
  Mail,
  Crown,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';

export function AppNav() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || 'student';

  const activeNavLinks = useMemo(() => {
    if (role === 'recruiter') {
      return [
        { href: '/dashboard/recruiter', label: 'Recruiter Hub', icon: LayoutDashboard, enabled: true },
        { href: '/sourcing', label: 'Talent Sourcing', icon: Target, enabled: true },
        { href: '/jobs', label: 'Job Requisitions', icon: Briefcase, enabled: true },
        { href: '/interview-prep', label: 'Interviews', icon: MessageSquare, enabled: true },
        { href: '/profile', label: 'Profile', icon: UserIcon, enabled: true },
      ];
    }
    if (role === 'admin') {
      return [
        { href: '/dashboard/admin', label: 'Admin Panel', icon: LayoutDashboard, enabled: true },
        { href: '/admin/performance', label: 'Performance', icon: Target, enabled: true },
        { href: '/profile', label: 'Profile', icon: UserIcon, enabled: true },
      ];
    }
    if (role === 'super_admin') {
      return [
        { href: '/dashboard/super-admin', label: 'Super Admin Hub', icon: LayoutDashboard, enabled: true },
        { href: '/admin/performance', label: 'System Metrics', icon: Target, enabled: true },
        { href: '/profile', label: 'Security & RBAC', icon: UserIcon, enabled: true },
      ];
    }

    return [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
      { href: '/auto-apply', label: 'Auto-Apply', icon: Bot, enabled: true },
      { href: '/resume', label: 'Resume & ATS', icon: Target, enabled: true },
      { href: '/jobs', label: 'Jobs', icon: Briefcase, enabled: true },
      { href: '/applications', label: 'Tracker', icon: KanbanSquare, enabled: true },
      { href: '/cover-letter', label: 'Cover Letter', icon: FileText, enabled: true },
      { href: '/interview-prep', label: 'Interview', icon: MessageSquare, enabled: true },
      { href: '/career-coach', label: 'Coach', icon: Compass, enabled: true },
      { href: '/email-sync', label: 'Email AI', icon: Mail, enabled: true },
      { href: '/pricing', label: 'Plans', icon: Crown, enabled: true },
    ];
  }, [role]);

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AA';

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl pt-safe">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ApplyAI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {activeNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.enabled ? link.href : '#'}
                aria-disabled={!link.enabled}
                className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : link.enabled
                    ? 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    : 'cursor-not-allowed text-muted-foreground/40'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-0.5 ring-offset-2 ring-offset-background transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-brand-gradient text-sm font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">Signed in</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Hamburger Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle mobile menu"
            className="xl:hidden h-10 w-10 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Sliding Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-background/95 backdrop-blur-2xl xl:hidden animate-fade-in-up pb-safe">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation Menu
            </p>
            <div className="space-y-1">
              {activeNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.enabled ? link.href : '#'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 border-t border-border pt-6 space-y-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-base font-medium text-foreground hover:bg-secondary"
              >
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-base font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          <div className="border-t border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{user?.email}</span>
          </div>
        </div>
      )}
    </header>
  );
}
