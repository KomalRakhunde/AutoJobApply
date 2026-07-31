'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Send,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { RecruiterCandidate } from '@/lib/recruiter-api';
import { useToast } from '@/hooks/use-toast';

interface OfferLetterDialogProps {
  candidate: RecruiterCandidate;
  jobRole?: string;
  companyName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOfferSent?: (candidateId: string) => void;
}

export function OfferLetterDialog({
  candidate,
  jobRole = 'Software Engineer Intern',
  companyName = 'Lexon IT Solutions Pvt Ltd',
  open,
  onOpenChange,
  onOfferSent,
}: OfferLetterDialogProps) {
  const { toast } = useToast();

  const [offerType, setOfferType] = useState<'INTERNSHIP' | 'FULL_TIME'>('INTERNSHIP');

  const [role, setRole] = useState(jobRole || 'Software Engineer Intern');
  const [company, setCompany] = useState(companyName || 'Lexon IT Solutions Pvt Ltd');
  const [companyWebsite, setCompanyWebsite] = useState('https://www.lexonit.com');
  const [location, setLocation] = useState('Remote');
  const [supervisor, setSupervisor] = useState('Komal Rakhunde');
  const [eligibilityTrack, setEligibilityTrack] = useState('AI Full Stack Development');
  const [joiningDate, setJoiningDate] = useState('June 22, 2026');
  const [stipendDetails, setStipendDetails] = useState('3 Months Internship; Post 3 months based on performance stipend will be provided');
  const [leaveDays, setLeaveDays] = useState('6');
  const [noticeDays, setNoticeDays] = useState('15');

  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!open) return null;

  const todayStr = 'June 22, 2026';

  const generateLetterText = () => {
    if (offerType === 'INTERNSHIP') {
      return `Date: ${todayStr}
Subject: ${candidate.name} Offer Letter

Dear ${candidate.name},

Welcome to ${company}! We are delighted to offer you the position of ${role} at ${company}. Your skills and experience align perfectly with our vision, and we are thrilled to have you join our team.

EMPLOYMENT DETAILS:
--------------------------------------------------
• Position: ${role}
• Joining Date: ${joiningDate}
• Work Location: ${location}
• Stipend Terms: ${stipendDetails}
• Eligibility / Track: ${eligibilityTrack}
• Reporting Manager / Supervisor: ${supervisor}

KEY RESPONSIBILITIES:
• Develop and maintain backend applications.
• Debug and fix backend performance issues.
• Collaborate with designers and backend developers.
• Write clean and efficient code.
• Test applications for reliability and usability.
• Learn and apply new technologies as required.
• Document code and project processes.

${company} INTERN POLICY & GUIDELINES:
1. Internship Duration: The internship period is specified in this offer letter and should be adhered to unless mutually agreed otherwise.
2. Working Hours: Interns are expected to work during the agreed-upon hours. Notify your supervisor in advance for absences.
3. Stipend: Stipends will be processed at the end of each month subject to attendance and performance.
4. Attendance & Leave: Regular attendance is essential. Interns are entitled to a maximum of ${leaveDays} days of leave during the internship.
5. Code of Conduct: Interns must adhere to professional behavior standards and values.
6. Confidentiality: Maintain strict confidentiality regarding company information, client details, and proprietary tools.
7. Ownership of Work: All work completed during the internship remains the property of ${company}.
8. Use of Company Equipment: Any software or equipment provided should be used responsibly.
9. Performance & Feedback: Regular feedback sessions will be conducted to assess performance.
10. Termination: Either party may terminate the internship by providing ${noticeDays} days notice.
11. Certificate of Completion: Awarded upon successful finishing of responsibilities.
12. General Guidelines: Dress appropriately and maintain a positive attitude.

ACKNOWLEDGMENT & ACCEPTANCE:
I, ${candidate.name}, accept the offer as a ${role} with ${company} under the terms and conditions stated above.

Signature: _________________________
Date: _____________________________

Warm regards,
HR Team, ${company}
Website: ${companyWebsite}`;
    }

    return `OFFICIAL EMPLOYMENT OFFER LETTER
Date: ${todayStr}

Dear ${candidate.name},

We are thrilled to offer you the position of ${role} at ${company}!

OFFER DETAILS:
• Position: ${role}
• Work Location: ${location}
• Target Start Date: ${joiningDate}
• Reporting Manager: ${supervisor}
• Base Compensation: $145,000 / yr
• Signing Bonus: $10,000

Sincerely,
Talent Acquisition Team, ${company}`;
  };

  const offerText = generateLetterText();

  const handleSendOfferEmail = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/recruiter/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.name,
          candidateEmail: candidate.email,
          jobRole: role,
          companyName: company,
          subject: `${candidate.name} Offer Letter — ${role} at ${company}`,
          score: candidate.scores[0]?.overallScore || 92,
          emailType: 'OFFER_LETTER',
          salary: stipendDetails,
          currency: 'INR / USD',
          joiningDate,
          signingBonus: 'N/A',
          customNotes: `Reporting Supervisor: ${supervisor} | Work Location: ${location} | Eligibility: ${eligibilityTrack}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: '🎉 Formal Offer Letter Dispatched!',
          description: `Lexon IT format offer letter email successfully delivered to ${candidate.email}.`,
        });
        onOfferSent?.(candidate.id);
      } else {
        toast({
          title: 'Offer Dispatch Warning',
          description: data.error || 'Failed to dispatch offer email.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Dispatch Failed',
        description: err.message || 'Could not send offer email.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(offerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Offer Letter Copied', description: 'Complete offer letter formatted text copied to clipboard.' });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Lexon IT Offer Letter - ${candidate.name}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .company { font-size: 24px; font-weight: bold; color: #4f46e5; margin: 0; }
            .sub { color: #64748b; font-size: 13px; margin-top: 4px; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; }
            .policy-list { font-size: 12px; color: #334155; }
            .signature { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 20px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="company">${company}</h1>
              <p class="sub">${companyWebsite} • Official Employment Offer Letter</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold; font-size: 13px;">Date: ${todayStr}</p>
            </div>
          </div>

          <pre style="white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #1e293b;">${offerText}</pre>

          <div class="signature">
            <p><strong>Acknowledgment and Acceptance:</strong></p>
            <p>I, <strong>${candidate.name}</strong>, accept the offer as a <strong>${role}</strong> with <strong>${company}</strong> under the terms and conditions stated above.</p>
            <br/><br/>
            <table style="width: 100%;">
              <tr>
                <td>Signature: _________________________</td>
                <td style="text-align: right;">Date: _____________________________</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-in">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Formal Employment & Internship Offer Manager</span>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 text-xs font-bold">
                  Lexon IT Format
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Generate, customize, print, and email formal offer letters with complete intern policy guidelines.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Offer Format Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => {
              setOfferType('INTERNSHIP');
              setRole('Software Engineer Intern');
              setCompany('Lexon IT Solutions Pvt Ltd');
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              offerType === 'INTERNSHIP'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Software Engineer Intern Offer (Lexon IT Format)
          </button>
          <button
            onClick={() => {
              setOfferType('FULL_TIME');
              setRole('Senior Full Stack Engineer');
              setCompany('ApplyAI Corp');
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              offerType === 'FULL_TIME'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Full-Time Full Stack Engineer Offer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Offer Details</span>
            </h3>

            <div className="space-y-1">
              <Label className="text-slate-500 font-semibold">Candidate Name</Label>
              <Input value={candidate.name} disabled className="h-8 text-xs bg-white dark:bg-slate-900 font-bold" />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-500 font-semibold">Position Title</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900 font-semibold" />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-500 font-semibold">Company Name</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900 font-semibold" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-slate-500 font-semibold">Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900" />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-500 font-semibold">Joining Date</Label>
                <Input value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900 font-bold text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-slate-500 font-semibold">Reporting Supervisor</Label>
              <Input value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900" />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-500 font-semibold">Track / Eligibility</Label>
              <Input value={eligibilityTrack} onChange={(e) => setEligibilityTrack(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900" />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-500 font-semibold">Stipend / Compensation Terms</Label>
              <Textarea value={stipendDetails} onChange={(e) => setStipendDetails(e.target.value)} rows={2} className="text-xs bg-white dark:bg-slate-900" />
            </div>
          </div>

          {/* Right Live Offer Letter Document Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Letter Preview
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyText}
                  className="h-8 text-xs rounded-xl gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="h-8 text-xs rounded-xl gap-1"
                >
                  <Printer className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Print / Save PDF</span>
                </Button>
              </div>
            </div>

            {/* Document Box */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm text-xs font-sans max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-lg text-indigo-600 dark:text-indigo-400 tracking-tight">{company}</h3>
                  <p className="text-[11px] text-slate-400">{companyWebsite} • Employment Offer Letter</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Date: {todayStr}</span>
                </div>
              </div>

              <div className="space-y-3 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                <p><strong>Subject:</strong> {candidate.name} Offer Letter</p>
                <p>Dear <strong>{candidate.name}</strong>,</p>
                <p>
                  Welcome to <strong>{company}</strong>! We are delighted to offer you the position of{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400">{role}</strong> at {company}. Your skills and experience align perfectly with our vision, and we are thrilled to have you join our team.
                </p>

                {/* Details Box */}
                <div className="my-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    Employment Details:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400">Position:</span> <strong className="text-slate-900 dark:text-white">{role}</strong></div>
                    <div><span className="text-slate-400">Joining Date:</span> <strong className="text-indigo-600 dark:text-indigo-400">{joiningDate}</strong></div>
                    <div><span className="text-slate-400">Location:</span> <strong className="text-slate-900 dark:text-white">{location}</strong></div>
                    <div><span className="text-slate-400">Reporting To:</span> <strong className="text-slate-900 dark:text-white">{supervisor}</strong></div>
                    <div className="col-span-2"><span className="text-slate-400">Stipend:</span> <strong>{stipendDetails}</strong></div>
                  </div>
                </div>

                {/* Policy List Preview */}
                {offerType === 'INTERNSHIP' && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      {company} Intern Policy Highlights:
                    </h5>
                    <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                      <li><strong>Internship Duration:</strong> As specified in this offer letter.</li>
                      <li><strong>Working Hours:</strong> Expected during agreed-upon hours.</li>
                      <li><strong>Stipend:</strong> Processed at the end of each month subject to performance.</li>
                      <li><strong>Attendance & Leave:</strong> Maximum of {leaveDays} days pre-approved leave.</li>
                      <li><strong>Confidentiality:</strong> Maintain strict confidentiality regarding proprietary tools.</li>
                      <li><strong>Termination:</strong> Either party may terminate with {noticeDays} days notice.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Acknowledgment Signature Block */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Acknowledgment and Acceptance:</p>
                <p className="text-slate-600 dark:text-slate-300">
                  I, <strong>{candidate.name}</strong>, accept the offer as a <strong>{role}</strong> with <strong>{company}</strong> under the terms and conditions stated above.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-3 text-slate-400">
                  <div>Signature: _________________________</div>
                  <div>Date: _____________________________</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-xs font-semibold w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={isSending}
                onClick={handleSendOfferEmail}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs px-6 font-bold gap-2 shadow-md shadow-emerald-600/20 w-full sm:w-auto"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Lexon IT Offer...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Lexon IT Offer Email</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
