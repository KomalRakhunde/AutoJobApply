'use client';

import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { href: '/resume', label: 'Resume & ATS', icon: Target, enabled: true },
  { href: '/jobs', label: 'Jobs', icon: Briefcase, enabled: true },
  { href: '/cover-letter', label: 'Cover Letter', icon: FileText, enabled: true },
  { href: '/applications', label: 'Tracker', icon: KanbanSquare, enabled: true },
  { href: '/interview-prep', label: 'Interview', icon: MessageSquare, enabled: true },
  { href: '/profile', label: 'Profile', icon: UserIcon, enabled: true },
];

export function AppNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AA';

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ApplyAI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.enabled ? link.href : '#'}
                aria-disabled={!link.enabled}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  link.enabled
                    ? 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    : 'cursor-not-allowed text-muted-foreground/40'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
                {!link.enabled && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

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
      </div>
    </header>
  );
}
