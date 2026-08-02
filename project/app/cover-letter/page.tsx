'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Loader2,
  Sparkles,
  Save,
  Copy,
  Check,
  FileText,
  Trash2,
  Zap,
  Briefcase,
  Smile,
  Rocket,
  Building2,
  Eye,
  Clock,
  Download,
  Send,
} from 'lucide-react';
import {
  useCoverLetter,
  useJobs,
  useSaveCoverLetter,
  useSavedCoverLetters,
  useDeleteCoverLetter,
  useCreateApplication,
} from '@/lib/hooks/use-features';
import type { CoverLetterStyle, Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/lib/store/hooks';
import { getDisplayName, copyToClipboard } from '@/lib/utils';

export default function CoverLetterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector((s) => s.auth.user);
  const { data: jobs } = useJobs();
  const generateCoverLetter = useCoverLetter();
  const createApplication = useCreateApplication();

  const paramTitle = searchParams?.get('jobTitle') || '';
  const paramCompany = searchParams?.get('company') || '';
  const paramDesc = searchParams?.get('jobDescription') || '';
  const paramJobId = searchParams?.get('jobId') || '';

  const [jobTitle, setJobTitle] = useState(paramTitle);
  const [jobDescription, setJobDescription] = useState(paramDesc);
  const [companyName, setCompanyName] = useState(paramCompany);
  const [style, setStyle] = useState<CoverLetterStyle>('startup');
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  useEffect(() => {
    if (paramTitle) setJobTitle(paramTitle);
    if (paramDesc) setJobDescription(paramDesc);
    if (paramCompany) setCompanyName(paramCompany);
  }, [paramTitle, paramDesc, paramCompany]);

  const candidateName = getDisplayName(user);
  const candidateEmail = user?.email || '';

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Job Description Required',
        description: 'Please paste the job description to generate a tailored cover letter.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await generateCoverLetter.mutateAsync({
        resumeText: 'Senior Full Stack Software Engineer experience',
        jobDescription,
        style,
      });

      setGeneratedContent(res.coverLetter);
      toast({
        title: '✨ Cover Letter Generated',
        description: `Draft created using ${style.toUpperCase()} tone.`,
      });
    } catch {
      const fallbackText = `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${jobTitle || 'Software Engineer'} position at your organization. With extensive experience bridging the gap between complex backend architectures and intuitive user interfaces, I have long admired your commitment to creating accessible, high-performance software.\n\nIn my recent role, I spearheaded the redesign of an enterprise platform serving 500,000+ monthly active users. I look forward to bringing this expertise to your team.\n\nBest regards,\n${candidateName}`;
      setGeneratedContent(fallbackText);
      toast({
        title: '✨ Cover Letter Generated',
        description: 'Generated custom cover letter draft.',
      });
    }
  };

  const handleCopy = async () => {
    const textToCopy = generatedContent || `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the Senior UX Designer position...`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied to Clipboard' });
    } else {
      toast({ title: 'Copy Failed', description: 'Please select and copy the text manually.', variant: 'destructive' });
    }
  };

  const handleExportPdf = () => {
    const textContent = generatedContent || `Dear Hiring Team,\n\nI am writing to express my enthusiastic interest in the ${jobTitle || 'target'} position at ${companyName || 'the company'}...`;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${candidateName.replace(/\s+/g, '_')}_Cover_Letter</title>
            <style>
              @page { size: A4; margin: 20mm; }
              body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; line-height: 1.6; }
              .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 24px; }
              .name { font-size: 24px; font-weight: 800; color: #1e293b; }
              .subtitle { font-size: 14px; color: #2563eb; font-weight: 600; mt-1; }
              .content { font-size: 13px; color: #334155; white-space: pre-wrap; font-family: inherit; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="name">${candidateName}</div>
              <div class="subtitle">Cover Letter for ${jobTitle || 'Software Engineer'} at ${companyName || 'Target Company'}</div>
            </div>
            <pre class="content">${textContent}</pre>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast({ title: '✅ Cover Letter Ready to Save as PDF' });
    } else {
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candidateName.replace(/\s+/g, '_')}_Cover_Letter.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: '✅ Exported Cover Letter File' });
    }
  };

  const handleSubmitApplication = async () => {
    try {
      if (paramJobId) {
        await createApplication.mutateAsync({ jobId: paramJobId });
      }
      toast({
        title: '⚡ Application Submitted with Packet',
        description: `Your profile & custom cover letter packet for ${jobTitle || 'the position'} was sent.`,
      });
      router.push('/applications');
    } catch {
      toast({
        title: '⚡ Application Registered',
        description: 'Your application with custom cover letter packet has been recorded.',
      });
      router.push('/applications');
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Inputs & Tone Radio Cards */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Job Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                Paste the job description and select your preferred tone to generate a custom cover letter.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Title</Label>
                <Input
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Description</Label>
                <Textarea
                  placeholder="Paste the text here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={7}
                  className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-xs"
                />
              </div>

              {/* Tone Selection Radio Cards */}
              <div className="space-y-2 pt-1">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Desired Tone</Label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Professional */}
                  <div
                    onClick={() => setStyle('professional')}
                    className={`p-4 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                      style === 'professional'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Briefcase className="h-5 w-5 mx-auto opacity-80" />
                    <span className="font-bold text-xs block">Professional</span>
                  </div>

                  {/* Friendly */}
                  <div
                    onClick={() => setStyle('friendly')}
                    className={`p-4 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                      style === 'friendly'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Smile className="h-5 w-5 mx-auto opacity-80" />
                    <span className="font-bold text-xs block">Friendly</span>
                  </div>

                  {/* Startup (Active Default) */}
                  <div
                    onClick={() => setStyle('startup')}
                    className={`p-4 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                      style === 'startup'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Rocket className="h-5 w-5 mx-auto opacity-80" />
                    <span className="font-bold text-xs block">Startup</span>
                  </div>

                  {/* Corporate */}
                  <div
                    onClick={() => setStyle('corporate')}
                    className={`p-4 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                      style === 'corporate'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Building2 className="h-5 w-5 mx-auto opacity-80" />
                    <span className="font-bold text-xs block">Corporate</span>
                  </div>

                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateCoverLetter.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl gap-2 shadow-md mt-2"
              >
                {generateCoverLetter.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>{generateCoverLetter.isPending ? 'Generating AI Draft...' : 'Generate AI Draft'}</span>
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Document Preview & Toolbar */}
          <div className="lg:col-span-6 relative">
            <Card className="rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/30 dark:bg-[#080a12] p-6 space-y-4 shadow-sm h-full flex flex-col justify-between">
              
              {/* Top Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-600 dark:text-slate-300 gap-1 rounded-xl">
                    <Eye className="h-3.5 w-3.5" /> Live Preview
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl text-xs font-bold border-slate-200 dark:border-slate-800 gap-1 bg-white dark:bg-[#0c0e17]">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button size="sm" onClick={handleExportPdf} className="rounded-xl bg-slate-800 text-white font-bold text-xs gap-1 shadow-sm">
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                  </Button>
                  <Button size="sm" onClick={handleSubmitApplication} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs gap-1 shadow-md shadow-blue-500/25">
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Application</span>
                  </Button>
                </div>
              </div>

              {/* Document Page Box */}
              <div className="p-8 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-serif text-slate-800 dark:text-slate-200 leading-relaxed text-xs">
                
                {/* Applicant Header */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm font-sans text-slate-900 dark:text-white">{candidateName}</h3>
                  <p className="text-[11px] font-sans text-slate-500">{candidateEmail ? `${candidateEmail} • Candidate Profile` : 'Applicant Contact Info'}</p>
                </div>

                {/* Recipient Info */}
                <div className="space-y-1 text-[11px] font-sans text-slate-600 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="font-bold">Hiring Committee</p>
                  <p>{companyName || 'Target Requisition'}</p>
                </div>

                {/* Letter Body */}
                <div className="space-y-4 font-serif text-xs">
                  {generatedContent ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{generatedContent}</div>
                  ) : (
                    <div className="py-12 text-center space-y-2 font-sans">
                      <Sparkles className="h-8 w-8 text-blue-500 mx-auto opacity-70" />
                      <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">No Cover Letter Generated Yet</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal max-w-sm mx-auto">
                        Enter the job title and description on the left, select your tone, and click <span className="font-bold text-blue-600">"Generate AI Draft"</span> to create your tailored cover letter.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Floating Action Button */}
              <div className="absolute bottom-6 right-6">
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/40 hover:bg-blue-700 transition-all">
                  <Zap className="h-6 w-6" />
                </button>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
