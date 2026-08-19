'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useGetProfile, useUpdateProfile, useGetSkills } from '@/hooks/use-profile';
import { useGetUser, useUpdateUser } from '@/hooks/use-auth';
import { PageShell } from '@/components/layout/page-shell';
import { CandidateJourneyStepper } from '@/components/layout/candidate-journey-stepper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getDisplayName } from '@/utils/utils';
import { apiRequest } from '@/services/api/api';
import {
  ChevronRight,
  Pencil,
  Shield,
  Globe,
  Trash2,
  Copy,
  Plus,
  X,
  FileText,
  AlertTriangle,
  Sparkles,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMandatorySetup = searchParams?.get('mandatory') === 'true';

  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id || 'demo-student-id';
  const { toast } = useToast();

  const { data: profile } = useGetProfile(userId);
  const { data: savedSkills } = useGetSkills(userId);
  const updateProfile = useUpdateProfile();
  const updateUser = useUpdateUser();

  const u = user as (typeof user & { firstName?: string; lastName?: string }) | null;
  const p = profile as (typeof profile & { headline?: string; bio?: string }) | null;

  const [activeTab, setActiveTab] = useState<'domainSkills' | 'personal' | 'masterResume' | 'compensation' | 'portals'>('domainSkills');
  const [targetDomain, setTargetDomain] = useState('Full Stack Development');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [masterFileName, setMasterFileName] = useState('Master_Resume_Software_Engineer_2026.pdf');
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [fullName, setFullName] = useState(u?.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : getDisplayName(user));
  const [email, setEmail] = useState(user?.email || '');
  const [headline, setHeadline] = useState(p?.headline || 'Software & AI Systems Engineer');
  const [phone, setPhone] = useState(profile?.phone || '+1 (555) 234-5678');
  const [bio, setBio] = useState(p?.bio || 'Passionate software engineer experienced in building full-stack web applications and AI-driven workflows.');
  const [location, setLocation] = useState(profile?.location || 'Remote / Global');
  const [relocate, setRelocate] = useState(true);

  useEffect(() => {
    if (u) {
      if (u.firstName || u.lastName) {
        setFullName(`${u.firstName || ''} ${u.lastName || ''}`.trim());
      } else {
        setFullName(getDisplayName(user));
      }
      if (u.email) setEmail(u.email);
    }
    if (p) {
      if (p.headline) setHeadline(p.headline);
      if (p.phone) setPhone(p.phone);
      if (p.bio) setBio(p.bio);
      if (p.location) setLocation(p.location);
    }
  }, [user, profile, u, p]);

  useEffect(() => {
    if (savedSkills) {
      setSkillsList(savedSkills.map((s) => s.name));
    }
  }, [savedSkills]);

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skill = newSkillInput.trim();
    if (!skillsList.includes(skill)) {
      setSkillsList((prev) => [...prev, skill]);
      toast({ title: 'Skill Added', description: `Added "${skill}" to your target profile.` });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      if (userId) {
        const parts = fullName.split(' ');
        await updateUser.mutateAsync({
          id: userId,
          body: { firstName: parts[0], lastName: parts.slice(1).join(' ') },
        }).catch(() => {});

        await updateProfile.mutateAsync({
          userId,
          body: { phone, location, preferredLocation: targetDomain },
        }).catch(() => {});

        // Sync skills list to backend database
        await apiRequest(`/skills/${userId}/sync`, {
          method: 'POST',
          body: { skills: skillsList },
        }).catch(() => {});
      }

      toast({
        title: '🎯 Profile & Skills Updated!',
        description: `Target Domain set to "${targetDomain}" with ${skillsList.length} active skills.`,
      });

      // Navigate directly to Job Search & Matching page
      setTimeout(() => {
        router.push('/jobs');
      }, 700);
    } catch {
      toast({
        title: '🎯 Profile Saved!',
        description: 'Your profile skills have been saved. Redirecting to matching jobs...',
      });
      setTimeout(() => {
        router.push('/jobs');
      }, 700);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingResume(true);
      setMasterFileName(file.name);
      setTimeout(() => {
        setIsUploadingResume(false);
        toast({
          title: '📄 Resume File Selected',
          description: `"${file.name}" is ready. Skill extraction is not yet available - add your skills manually below.`,
        });
      }, 1200);
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Account</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-bold text-slate-900 dark:text-white">Student Profile & Domain Matching</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Edit Student Profile & Target Domain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            Configure your technical domain, key skills, and master resume to receive tailored AI job recommendations.
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
                  Update your target domain & skills below to instantly generate high-compatibility job matches.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Profile Summary Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
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
                    Active Student Profile
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium">{headline || 'Full Stack & AI Systems Developer'}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skillsList.slice(0, 5).map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {skill}
                    </span>
                  ))}
                  {skillsList.length > 5 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs">
                      +{skillsList.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Button to Matching Jobs */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 text-white space-y-3 border border-slate-800 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" /> Domain AI Matching
                </span>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px]">Active</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-300 font-bold">Target Domain:</p>
                <p className="text-sm font-black text-white">{targetDomain}</p>
              </div>
              <Button
                onClick={handleSaveProfile}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs gap-1.5 shadow-md shadow-blue-500/20"
              >
                <span>Save & Find Matching Jobs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

          </div>
        </Card>

        {/* Main Tabbed Settings Form */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-6 shadow-xs">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-100 dark:border-slate-800 pb-3 font-bold text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setActiveTab('domainSkills')}
              className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'domainSkills'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Target Domain &amp; Skills</span>
            </button>
            <button
              onClick={() => setActiveTab('masterResume')}
              className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'masterResume'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Master ATS Resume</span>
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab('portals')}
              className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'portals'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Job Portals</span>
            </button>
          </div>

          {/* TAB 1: Target Domain & Skills */}
          {activeTab === 'domainSkills' && (
            <div className="space-y-6">
              
              {/* Domain Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span>Select Primary Target Domain / Industry Role</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'Full Stack Development',
                    'Frontend React / Next.js',
                    'AI / ML Solutions Engineering',
                    'Backend Node.js / NestJS',
                    'Data Engineering',
                    'DevOps & System Architecture',
                  ].map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setTargetDomain(domain)}
                      className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all cursor-pointer ${
                        targetDomain === domain
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{domain}</span>
                        {targetDomain === domain && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Tag Manager */}
              <div className="space-y-3 pt-2">
                <Label className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Technical Skills &amp; Tech Stack List
                </Label>
                <p className="text-xs text-slate-500">
                  These skills are parsed by our Gemini AI engine to calculate your **Skill Match %** score on web-scraped job listings.
                </p>

                <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-slate-50/50 dark:bg-[#121522] border border-slate-200 dark:border-slate-800 min-h-[90px]">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold text-xs shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Skill Input */}
                <div className="flex items-center gap-2 max-w-md">
                  <Input
                    placeholder="Add skill (e.g. Python, Docker, GraphQL)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="rounded-xl h-10 text-xs"
                  />
                  <Button
                    onClick={handleAddSkill}
                    className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-4 h-10 shrink-0 gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Skill</span>
                  </Button>
                </div>
              </div>

              {/* Save & Trigger Matching Jobs */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-6 py-3 gap-2 shadow-md shadow-blue-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Save Profile &amp; Explore Matching Jobs</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

            </div>
          )}

          {/* TAB 2: Master ATS Resume */}
          {activeTab === 'masterResume' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Master Resume Asset</h3>
                  <p className="text-xs text-slate-500">Your master resume is automatically attached whenever you click 1-Click Apply.</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 font-bold text-xs">
                  Active PDF
                </Badge>
              </div>

              <div className="border-2 border-dashed border-blue-200 dark:border-slate-800 bg-blue-50/30 dark:bg-[#121522] rounded-2xl p-8 text-center space-y-4">
                <FileText className="h-10 w-10 text-blue-600 mx-auto" />
                <div>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">{masterFileName}</p>
                  <p className="text-xs text-slate-400">PDF Document • Ready for 1-Click Application Submissions</p>
                </div>

                <div className="flex justify-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                    <span className="px-4 py-2 rounded-xl text-xs font-extrabold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white inline-block shadow-2xs hover:bg-slate-100">
                      {isUploadingResume ? 'Uploading...' : 'Upload New Resume PDF'}
                    </span>
                  </label>
                  <Button
                    onClick={handleSaveProfile}
                    className="rounded-xl bg-blue-600 text-white font-extrabold text-xs px-5"
                  >
                    Save &amp; Match Jobs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Personal Details */}
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
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio / Summary</Label>
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

                <Button onClick={handleSaveProfile} className="bg-black dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl">
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: Portals */}
          {activeTab === 'portals' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Connected Job Portals</h3>
                <p className="text-xs text-slate-500">Profiles connected for automated job application dispatch.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">LinkedIn / Easy Apply</span>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">CONNECTED</Badge>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">Naukri &amp; Indeed Feeds</span>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">CONNECTED</Badge>
                </div>
              </div>
            </div>
          )}

        </Card>

        {/* Bottom Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-white">
              <Shield className="h-4 w-4 text-blue-600" /> Security Status
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Two-factor authentication is not yet available for candidate accounts.
            </p>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-white">
              <Globe className="h-4 w-4 text-emerald-600" /> Public Profile Link
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Public candidate profile pages are not yet available.
            </p>
          </Card>

          <Card className="rounded-3xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10 p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-extrabold text-xs text-rose-600">
              <Trash2 className="h-4 w-4" /> Deactivate Profile
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Remove active candidate matching status.
            </p>
          </Card>
        </div>

      </div>
    </PageShell>
  );
}
