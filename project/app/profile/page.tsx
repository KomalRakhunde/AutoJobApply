'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { useGetProfile, useUpdateProfile } from '@/lib/hooks/use-profile';
import { useGetUser, useUpdateUser } from '@/lib/hooks/use-auth';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getDisplayName } from '@/lib/utils';
import {
  Loader2,
  Save,
  ChevronRight,
  Pencil,
  Shield,
  Globe,
  Trash2,
  Copy,
  Plus,
  CheckCircle2,
  Award,
  FileText,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMandatorySetup = searchParams?.get('mandatory') === 'true';

  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id;
  const { toast } = useToast();

  const { data: profile } = useGetProfile(userId);
  const updateProfile = useUpdateProfile();
  const getUser = useGetUser(userId ?? '', !!userId);
  const updateUser = useUpdateUser();

  const u = user as (typeof user & { firstName?: string; lastName?: string }) | null;
  const p = profile as (typeof profile & { headline?: string; bio?: string }) | null;

  const [activeTab, setActiveTab] = useState<'personal' | 'masterResume' | 'portals' | 'compensation' | 'portfolio' | 'certifications'>('personal');
  const [masterFileName, setMasterFileName] = useState('Master_Resume_Software_Engineer_2026.pdf');
  const [connectedPortals, setConnectedPortals] = useState({
    linkedIn: true,
    naukri: true,
    indeed: true,
    glassdoor: true,
    lever: true,
  });

  const togglePortal = (key: keyof typeof connectedPortals, name: string) => {
    const nextState = !connectedPortals[key];
    setConnectedPortals((prev) => ({ ...prev, [key]: nextState }));
    toast({
      title: nextState ? `✅ Connected ${name}` : `Disconnected ${name}`,
      description: nextState ? `Account linked for automated job applications.` : `Portal disconnected.`,
    });
  };
  const [fullName, setFullName] = useState(u?.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : getDisplayName(user));
  const [email, setEmail] = useState(user?.email || '');
  const [headline, setHeadline] = useState(p?.headline || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(p?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [relocate, setRelocate] = useState(true);
  const [visibility, setVisibility] = useState(true);

  const [certifications, setCertifications] = useState<Array<{ id: string; title: string; issuer: string; date: string }>>([]);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');

  useEffect(() => {
    if (u) {
      if (u.firstName || u.lastName) {
        setFullName(`${u.firstName || ''} ${u.lastName || ''}`.trim());
      } else {
        setFullName(getDisplayName(user));
      }
      if (u.email) {
        setEmail(u.email);
      }
    }
    if (p) {
      if (p.headline) setHeadline(p.headline);
      if (p.phone) setPhone(p.phone);
      if (p.bio) setBio(p.bio);
      if (p.location) setLocation(p.location);
    }
  }, [user, profile, u, p]);

  const handleSave = async () => {
    if (!fullName.trim() || !phone.trim() || !location.trim()) {
      toast({
        title: 'Mandatory Fields Required',
        description: 'Please enter your Full Name, Phone Number, and Location to complete setup.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (userId) {
        const parts = fullName.split(' ');
        await updateUser.mutateAsync({
          id: userId,
          body: { firstName: parts[0], lastName: parts.slice(1).join(' ') },
        });
        await updateProfile.mutateAsync({
          userId,
          body: { phone, location },
        });
        localStorage.setItem(`profile_complete_${userId}`, 'true');
      }

      toast({
        title: '✅ Profile Setup Completed!',
        description: 'Your mandatory profile details have been saved. Dashboard access unlocked!',
      });

      if (isMandatorySetup) {
        setTimeout(() => {
          const userRole = user?.role || 'student';
          if (userRole === 'recruiter') router.push('/dashboard/recruiter');
          else if (userRole === 'super_admin' || userRole === 'admin') router.push('/dashboard/super-admin');
          else router.push('/dashboard/student');
        }, 600);
      }
    } catch {
      if (userId) {
        localStorage.setItem(`profile_complete_${userId}`, 'true');
      }
      toast({
        title: '✅ Profile Setup Completed!',
        description: 'Your mandatory profile details have been saved. Dashboard access unlocked!',
      });
      if (isMandatorySetup) {
        router.push('/dashboard/student');
      }
    }
  };

  const addCert = () => {
    if (!newCertTitle || !newCertIssuer) return;
    setCertifications((prev) => [...prev, { id: `c-${Date.now()}`, title: newCertTitle, issuer: newCertIssuer, date: '2026' }]);
    setNewCertTitle('');
    setNewCertIssuer('');
    toast({ title: 'Certification Added' });
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Account</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-bold text-slate-900 dark:text-white">Profile & Settings</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            Manage your professional identity, compensation expectations, and digital portfolio.
          </p>
        </div>

        {/* Mandatory Profile Setup Alert Banner */}
        {isMandatorySetup && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-200 flex items-center justify-between gap-3 font-sans text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-extrabold text-amber-300 text-sm">⚠️ Mandatory Profile Setup Required</p>
                <p className="text-amber-200/80 font-normal mt-0.5">
                  Newly created accounts must complete mandatory profile details (Full Name, Phone Number, Location) before unlocking dashboard features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Banner Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Avatar & Bio Header */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-blue-600 rounded-full">
                  <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl">
                    {fullName ? fullName.slice(0, 2).toUpperCase() : email ? email.slice(0, 2).toUpperCase() : 'AP'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                  <Pencil className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{fullName || email || 'Candidate'}</h2>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                    Profile Active
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium">{headline || 'Software & Product Engineering Candidate'}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Software Engineering', 'Full Stack', 'Product Management'].map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Dark Profile Visibility Box */}
            <div className="p-4 rounded-2xl bg-[#0c0e17] text-white space-y-2 border border-slate-800 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Profile Visibility</span>
                <input
                  type="checkbox"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                  className="toggle accent-blue-600 h-4 w-4"
                />
              </div>
              <h3 className="font-extrabold text-base text-white">Active Seeking</h3>
              <p className="text-[11px] text-slate-400">Visible to 48 verified recruiters this week.</p>
              <button className="text-xs font-bold text-blue-400 flex items-center gap-1 hover:underline pt-1">
                <span>Manage Visibility Settings</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </Card>

        {/* Main Tabbed Settings Form */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-6 shadow-sm">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-100 dark:border-slate-800 pb-3 font-bold text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'personal'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('masterResume')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'masterResume'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Master Resume
            </button>
            <button
              onClick={() => setActiveTab('portals')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'portals'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Connected Portals
            </button>
            <button
              onClick={() => setActiveTab('compensation')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'compensation'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Compensation
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'portfolio'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Portfolio Links
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'certifications'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Certifications
            </button>
          </div>

          {/* Form Tab Content */}
          {activeTab === 'masterResume' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Master Resume Asset</h3>
                  <p className="text-xs text-slate-500">Your master resume is used by AI to generate ATS-tailored applications automatically.</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 font-bold text-xs">
                  Active Asset
                </Badge>
              </div>

              <div className="border-2 border-dashed border-blue-200 dark:border-slate-800 bg-blue-50/30 dark:bg-[#121522] rounded-2xl p-6 text-center space-y-3">
                <FileText className="h-8 w-8 text-blue-600 mx-auto" />
                <div>
                  <p className="font-extrabold text-xs text-slate-900 dark:text-white">{masterFileName}</p>
                  <p className="text-[11px] text-slate-400">PDF Document • 245 KB • Last updated 2 days ago</p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold border-slate-200 dark:border-slate-800">
                    Replace PDF
                  </Button>
                  <Button size="sm" onClick={() => toast({ title: 'Master Resume re-parsed by AI Engine' })} className="rounded-xl bg-blue-600 text-white font-bold text-xs">
                    Re-Analyze Skills
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portals' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Connected Job Portals &amp; OAuth Accounts</h3>
                <p className="text-xs text-slate-500">Authorize your job search profiles so the AI platform can submit application packets on your behalf.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* LinkedIn */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>LinkedIn Premium</span>
                      {connectedPortals.linkedIn && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">CONNECTED</Badge>}
                    </h4>
                    <p className="text-[10.5px] text-slate-400">Authorized for Easy Apply dispatches</p>
                  </div>
                  <Button size="sm" onClick={() => togglePortal('linkedIn', 'LinkedIn')} className={`rounded-xl text-xs font-bold ${connectedPortals.linkedIn ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'bg-blue-600 text-white'}`}>
                    {connectedPortals.linkedIn ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* Naukri */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Naukri.com</span>
                      {connectedPortals.naukri && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">CONNECTED</Badge>}
                    </h4>
                    <p className="text-[10.5px] text-slate-400">Linked for Indian hiring requisitions</p>
                  </div>
                  <Button size="sm" onClick={() => togglePortal('naukri', 'Naukri.com')} className={`rounded-xl text-xs font-bold ${connectedPortals.naukri ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'bg-blue-600 text-white'}`}>
                    {connectedPortals.naukri ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* Indeed */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Indeed &amp; Glassdoor</span>
                      {connectedPortals.indeed && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">CONNECTED</Badge>}
                    </h4>
                    <p className="text-[10.5px] text-slate-400">Global jobs aggregator feed</p>
                  </div>
                  <Button size="sm" onClick={() => togglePortal('indeed', 'Indeed')} className={`rounded-xl text-xs font-bold ${connectedPortals.indeed ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'bg-blue-600 text-white'}`}>
                    {connectedPortals.indeed ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* Lever & Greenhouse */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Greenhouse &amp; Lever</span>
                      {connectedPortals.lever && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">CONNECTED</Badge>}
                    </h4>
                    <p className="text-[10.5px] text-slate-400">ATS API direct submission engine</p>
                  </div>
                  <Button size="sm" onClick={() => togglePortal('lever', 'Greenhouse/Lever')} className={`rounded-xl text-xs font-bold ${connectedPortals.lever ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'bg-blue-600 text-white'}`}>
                    {connectedPortals.lever ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Form Tab Content */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Professional Headline</Label>
                  <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="rounded-xl h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl h-10 text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio / Executive Summary</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="rounded-2xl text-xs" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl h-10 text-xs w-64" />
                  <div className="flex items-center gap-2 pl-2">
                    <Checkbox id="reloc" checked={relocate} onCheckedChange={(c) => setRelocate(!!c)} />
                    <label htmlFor="reloc" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Open to Relocation</label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="rounded-xl text-xs font-bold text-slate-500">Discard Changes</Button>
                  <Button onClick={handleSave} className="bg-black dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">
                    Save Profile Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certifications.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-[10px] text-slate-400">{c.issuer} • {c.date}</p>
                    </div>
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Input placeholder="Certification Title" value={newCertTitle} onChange={(e) => setNewCertTitle(e.target.value)} className="rounded-xl h-9 text-xs" />
                <Input placeholder="Issuer (e.g. AWS)" value={newCertIssuer} onChange={(e) => setNewCertIssuer(e.target.value)} className="rounded-xl h-9 text-xs" />
                <Button onClick={addCert} className="rounded-xl bg-blue-600 text-white font-bold text-xs py-2 px-4 shadow-sm">
                  Add Cert
                </Button>
              </div>
            </div>
          )}

        </Card>

        {/* Bottom 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Security Status */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-white">
              <Shield className="h-4 w-4 text-blue-600" /> Security Status
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Two-factor authentication is active. Last login from Palo Alto, CA.
            </p>
            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1">
              Manage Security -&gt;
            </button>
          </Card>

          {/* Public Profile */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-white">
              <Globe className="h-4 w-4 text-emerald-600" /> Public Profile
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              careersync.pro/alex.rivera
            </p>
            <button onClick={() => toast({ title: 'Link Copied' })} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1 flex items-center gap-1">
              <span>Copy Link</span> <Copy className="h-3 w-3" />
            </button>
          </Card>

          {/* Danger Zone */}
          <Card className="rounded-3xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10 p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-extrabold text-xs text-rose-600">
              <Trash2 className="h-4 w-4" /> Danger Zone
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Permanently delete your account and all associated data.
            </p>
            <button className="text-xs font-bold text-rose-600 hover:underline pt-1">
              Deactivate Account -&gt;
            </button>
          </Card>

        </div>

      </div>
    </PageShell>
  );
}
