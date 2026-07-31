'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Mail,
  UserCheck,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Recruiter' | 'Admin';
  status: 'Active' | 'Pending' | 'Suspended';
  lastLogin: string;
  enableAnalytics: boolean;
  apiAccess: boolean;
  betaFeatures: boolean;
}

const initialUsers: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Jordan Miles',
    email: 'jordan.miles@university.edu',
    role: 'Student',
    status: 'Active',
    lastLogin: '2 mins ago',
    enableAnalytics: true,
    apiAccess: false,
    betaFeatures: true,
  },
  {
    id: 'u-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@techcorp.com',
    role: 'Recruiter',
    status: 'Pending',
    lastLogin: '—',
    enableAnalytics: true,
    apiAccess: true,
    betaFeatures: false,
  },
  {
    id: 'u-3',
    name: 'Marcus Vane',
    email: 'marcus.v@careersync.pro',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Yesterday',
    enableAnalytics: true,
    apiAccess: true,
    betaFeatures: true,
  },
  {
    id: 'u-4',
    name: 'Elena Rodriguez',
    email: 'elena.rod@univ.edu',
    role: 'Student',
    status: 'Suspended',
    lastLogin: '3 days ago',
    enableAnalytics: false,
    apiAccess: false,
    betaFeatures: true,
  },
];

export default function AdminUserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Drawer Edit Form States */
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'Student' | 'Recruiter' | 'Admin'>('Student');
  const [editAnalytics, setEditAnalytics] = useState(true);
  const [editApiAccess, setEditApiAccess] = useState(false);
  const [editBetaFeatures, setEditBetaFeatures] = useState(true);

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const handleOpenUser = (u: UserRecord) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditAnalytics(u.enableAnalytics);
    setEditApiAccess(u.apiAccess);
    setEditBetaFeatures(u.betaFeatures);
    setDrawerOpen(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: editName,
              email: editEmail,
              role: editRole,
              enableAnalytics: editAnalytics,
              apiAccess: editApiAccess,
              betaFeatures: editBetaFeatures,
            }
          : u
      )
    );
    setDrawerOpen(false);
    toast({
      title: '✅ Profile & Permissions Saved',
      description: `Updated account settings for ${editName}.`,
    });
  };

  const handleImpersonate = (u: UserRecord) => {
    toast({
      title: `🔑 Impersonating ${u.name}`,
      description: `Switched to ${u.role} view for customer support troubleshooting.`,
    });
  };

  const handleStatusChange = (userId: string, newStatus: 'Active' | 'Pending' | 'Suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    toast({
      title: `🛡️ Status Updated`,
      description: `Account status set to ${newStatus}.`,
    });
  };

  const handleDeleteUser = (userId: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast({
      title: `🗑️ User Deleted`,
      description: `Removed account record for ${name}.`,
    });
  };

  const handleResetPassword = (name: string) => {
    toast({
      title: `🔐 Password Reset Email Sent`,
      description: `Dispatched secure reset link to ${name}.`,
    });
  };

  return (
    <PageShell title="" subtitle="">
      <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
        
        {/* Top Header Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage accounts, monitor activity, and adjust system-wide permissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-2 py-2 px-4 shadow-xs"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            <Button className="bg-black dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-100 font-extrabold text-xs py-2 px-4 rounded-xl shadow-md gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Create User</span>
            </Button>
          </div>
        </div>

        {/* User Stats Bar: 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Total Users</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">12,842</h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+4.2%</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Active Students</span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">8,210</h3>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Recruiters</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">452</h3>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-1.5 shadow-xs">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Pending Invites</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">89</h3>
          </Card>

        </div>

        {/* Filterable User Table Container */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
          
          {/* Table Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users, emails, or roles..."
              className="pl-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a]"
            />
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleOpenUser(u)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white text-xs">
                            {u.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full font-extrabold text-[10px] ${
                          u.role === 'Student'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                            : u.role === 'Recruiter'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            u.status === 'Active'
                              ? 'bg-emerald-500'
                              : u.status === 'Pending'
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span
                          className={
                            u.status === 'Active'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : u.status === 'Pending'
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }
                        >
                          {u.status}
                        </span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{u.lastLogin}</td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="font-sans text-xs w-48">
                          <DropdownMenuItem onClick={() => handleOpenUser(u)} className="font-bold">
                            Edit Profile & Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleImpersonate(u)} className="text-blue-600 font-bold">
                            🔑 Log in as User (Impersonate)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(u.name)}>
                            🔐 Reset Password Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {u.status === 'Active' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'Suspended')} className="text-amber-600 font-bold">
                              ⏸️ Suspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'Active')} className="text-emerald-600 font-bold">
                              ✅ Activate Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteUser(u.id, u.name)} className="text-rose-600 font-bold">
                            🗑️ Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-400">
            <span>Showing 1-4 of 12,842 users</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button className="h-7 w-7 rounded-lg bg-black dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
                1
              </Button>
              <Button variant="outline" className="h-7 w-7 rounded-lg text-xs font-bold">
                2
              </Button>
              <Button variant="outline" className="h-7 w-7 rounded-lg text-xs font-bold">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

        </Card>

        {/* SLIDE-OVER USER EDIT DRAWER (Sheet) */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md bg-white dark:bg-[#0c0e17] border-l border-slate-200 dark:border-slate-800 p-6 space-y-6 overflow-y-auto">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-xl font-black text-slate-900 dark:text-white">
                User Details
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-500">
                Manage profile information, account status, and system permissions.
              </SheetDescription>
            </SheetHeader>

            {selectedUser && (
              <div className="space-y-6 font-sans text-xs pt-2">
                
                {/* User Avatar & Badge Header */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Avatar className="h-16 w-16 border-2 border-blue-600 shadow-md">
                    <AvatarFallback className="bg-blue-600 text-white font-black text-lg">
                      {selectedUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{editName}</h3>
                    <p className="text-xs text-slate-500">{editEmail}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-[10px] px-3 py-0.5 rounded-full">
                    {selectedUser.role}
                  </Badge>
                </div>

                {/* ACCOUNT SETTINGS Section */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    ACCOUNT SETTINGS
                  </h4>

                  <div className="space-y-1">
                    <Label htmlFor="displayName" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="emailAddr" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </Label>
                    <Input
                      id="emailAddr"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a] text-xs"
                    />
                  </div>
                </div>

                {/* PERMISSION MANAGEMENT Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    PERMISSION MANAGEMENT
                  </h4>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Enable Analytics</p>
                        <p className="text-[11px] text-slate-500">Allow user to view progress data</p>
                      </div>
                      <Checkbox
                        checked={editAnalytics}
                        onCheckedChange={(c) => setEditAnalytics(!!c)}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">API Access</p>
                        <p className="text-[11px] text-slate-500">Enable developer tools & Webhooks</p>
                      </div>
                      <Checkbox
                        checked={editApiAccess}
                        onCheckedChange={(c) => setEditApiAccess(!!c)}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Beta Features</p>
                        <p className="text-[11px] text-slate-500">Join early access preview programs</p>
                      </div>
                      <Checkbox
                        checked={editBetaFeatures}
                        onCheckedChange={(c) => setEditBetaFeatures(!!c)}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            <SheetFooter className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleSaveUser}
                className="w-full bg-black dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 font-extrabold text-xs py-3 rounded-xl shadow-md"
              >
                Save All Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

      </div>
    </PageShell>
  );
}
