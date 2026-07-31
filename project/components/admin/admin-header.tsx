'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  HelpCircle,
  User as UserIcon,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/auth-slice';

export function AdminHeader({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle?: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <header className="h-16 w-full shrink-0 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md px-6 flex items-center justify-between font-sans text-xs">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search system commands, users, or logs..."
          className="bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-sm w-80 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Icon with Dot Indicator */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#0b0f19]" />
        </button>

        {/* Help / Documentation Icon */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors hidden sm:block">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* User Profile Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full py-1 px-1.5 hover:bg-slate-800/50 transition-colors focus:outline-none cursor-pointer border border-slate-800/80">
              <Avatar className="h-8 w-8 border border-slate-700">
                <AvatarImage src="/avatars/admin.png" alt="Admin Control" />
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs">
                  AC
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block pr-2">
                <p className="font-extrabold text-xs text-slate-100 leading-none">
                  Admin Control
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  System Architect
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl font-sans text-xs bg-slate-900 border-slate-800 text-slate-200">
            <DropdownMenuLabel className="font-normal p-3">
              <p className="font-bold text-white">Admin Control</p>
              <p className="text-[11px] text-slate-400">{user?.email || 'admin@careersync.pro'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 text-slate-200">
              <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
              <span>Admin Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-500 font-bold hover:bg-slate-800 focus:bg-slate-800">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
