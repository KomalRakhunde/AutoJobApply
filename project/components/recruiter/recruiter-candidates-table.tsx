'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Award,
  Sparkles,
  Mail,
  Phone,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  User,
  Mic,
  Send,
  Clock,
  ExternalLink,
  MessageSquareText,
  Copy,
  Check,
  Loader2,
  Download,
  FileSpreadsheet,
  Filter,
} from 'lucide-react';
import { RecruiterCandidate, deleteCandidateData, createAutomatedSelectionEmail } from '@/lib/recruiter-api';
import { OfferLetterDialog } from '@/components/recruiter/offer-letter-dialog';
import { useToast } from '@/hooks/use-toast';

interface RecruiterCandidatesTableProps {
  candidates: RecruiterCandidate[];
  passingThreshold?: number;
  onRefresh?: () => void;
}

export function RecruiterCandidatesTable({
  candidates,
  passingThreshold = 75,
  onRefresh,
}: RecruiterCandidatesTableProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [filterStatus, setFilterStatus] = useState<'all' | 'qualified' | 'review'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterCandidate | null>(null);
  const [viewEmailCandidate, setViewEmailCandidate] = useState<RecruiterCandidate | null>(null);
  const [offerCandidate, setOfferCandidate] = useState<RecruiterCandidate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [customRecipientEmail, setCustomRecipientEmail] = useState('');
  const [isSendingRealEmail, setIsSendingRealEmail] = useState(false);
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<{
    mode?: 'REAL_SMTP' | 'ETHEREAL_PREVIEW';
    recipient?: string;
    previewUrl?: string;
    message?: string;
  } | null>(null);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast({ title: 'No Candidates to Export', description: 'Try adjusting your search filters.', variant: 'destructive' });
      return;
    }

    const headers = ['Candidate Name', 'Email', 'Phone', 'ATS Match Score (%)', 'Qualification Status', 'Top Skills'];
    const rows = filtered.map((c) => {
      const score = c.scores[0]?.overallScore || 0;
      const isQual = score >= passingThreshold;
      return [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email.replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        score,
        `"${isQual ? 'QUALIFIED' : 'REVIEW_REQUIRED'}"`,
        `"${(c.skills || []).join('; ').replace(/"/g, '""')}"`,
      ];
    });

    const csvData = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ApplyAI_Candidate_Intake_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: '📊 Candidate Report Exported!',
      description: `Successfully generated CSV report for ${filtered.length} candidate(s).`,
    });
  };

  const filtered = candidates
    .filter((c) => {
      const score = c.scores[0]?.overallScore || 0;
      if (filterStatus === 'qualified' && score < passingThreshold) return false;
      if (filterStatus === 'review' && score >= passingThreshold) return false;

      const query = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.skills && c.skills.some((s) => s.toLowerCase().includes(query)))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.scores[0]?.overallScore || 0;
        const scoreB = b.scores[0]?.overallScore || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete candidate data? This logs an audit entry.')) return;
    setDeletingId(candidateId);
    try {
      await deleteCandidateData(candidateId);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendOrResendEmail = async (candidate: RecruiterCandidate, targetEmailOverride?: string) => {
    const score = candidate.scores[0]?.overallScore || 0;
    const targetEmail = targetEmailOverride || customRecipientEmail || candidate.email;

    candidate.emailOutreach = createAutomatedSelectionEmail(
      candidate.name,
      targetEmail,
      'Senior Full Stack Engineer',
      'ApplyAI Corp',
      score,
      candidate.id
    );

    setIsSendingRealEmail(true);
    setEmailDeliveryStatus(null);

    try {
      const res = await fetch('/api/recruiter/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.name,
          candidateEmail: candidate.email,
          recipientEmail: targetEmail,
          jobRole: 'Senior Full Stack Engineer',
          companyName: 'ApplyAI Corp',
          score,
          interviewLink: `http://localhost:3001/interview-prep?candidate=${candidate.id}`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEmailDeliveryStatus({
          mode: data.mode,
          recipient: data.recipient,
          previewUrl: data.previewUrl,
          message: data.message,
        });

        if (data.mode === 'REAL_SMTP') {
          toast({
            title: '⚡ Real Email Dispatched!',
            description: `Selection email successfully delivered to ${data.recipient} via Gmail SMTP.`,
          });
        } else {
          toast({
            title: '📧 Preview Email Generated',
            description: `Dispatched to ${data.recipient}. Real credentials not detected in .env; check Live Preview.`,
          });
        }
      } else {
        toast({
          title: 'Email Dispatch Warning',
          description: data.error || 'Failed to dispatch real email via SMTP.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Error dispatching real email:', err);
      toast({
        title: 'Email Dispatch Failed',
        description: err.message || 'Could not connect to email server.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingRealEmail(false);
    }

    setViewEmailCandidate({ ...candidate });
    onRefresh?.();
  };

  const getScoreBadge = (score: number) => {
    if (score >= passingThreshold) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (score >= 60) {
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
    }
    return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800';
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Controls Bar with Left Accent & Hover Glow */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 p-4 rounded-3xl shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search candidate name, email, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl text-xs font-mono bg-slate-50 dark:bg-[#121522] border-slate-200 dark:border-slate-800"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#121522] p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              onClick={() => setFilterStatus('qualified')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'qualified'
                  ? 'bg-emerald-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Qualified ({candidates.filter(c => (c.scores[0]?.overallScore || 0) >= passingThreshold).length})
            </button>
            <button
              onClick={() => setFilterStatus('review')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'review'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Review ({candidates.filter(c => (c.scores[0]?.overallScore || 0) < passingThreshold).length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-8 text-xs font-bold rounded-xl gap-1.5 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Export CSV</span>
          </Button>

          <span className="text-xs text-slate-400 hidden sm:inline">|</span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#121522] p-1 rounded-xl">
            <button
              onClick={() => setSortBy('score')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                sortBy === 'score'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Score
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                sortBy === 'name'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                sortBy === 'date'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Date
            </button>
          </div>
        </div>
      </div>

      {/* Table Card with Left Accent & Hover Glow */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent overflow-hidden shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Candidate Info</th>
                <th className="py-3.5 px-4">Match Score</th>
                <th className="py-3.5 px-4">AI Executive Summary</th>
                <th className="py-3.5 px-4">Selection Email & Voice Interview</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      No candidates found matching criteria
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((candidate) => {
                  const topScoreObj = candidate.scores[0];
                  const score = topScoreObj?.overallScore || 0;
                  const isQualified = score >= passingThreshold;
                  const outreach = candidate.emailOutreach || (isQualified ? createAutomatedSelectionEmail(candidate.name, candidate.email, 'Senior Full Stack Engineer', 'ApplyAI Corp', score, candidate.id) : undefined);

                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="py-4 px-4 font-medium">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {candidate.name}
                            </span>
                            {isQualified ? (
                              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[9px] px-1.5 py-0">
                                Qualified
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[9px] px-1.5 py-0">
                                Review
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {candidate.email}
                            </span>
                            {candidate.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" />
                                {candidate.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* AI Score */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center justify-center font-extrabold text-sm px-2.5 py-1 rounded-xl border ${getScoreBadge(
                            score
                          )}`}
                        >
                          {score}%
                        </span>
                      </td>

                      {/* Summary */}
                      <td className="py-4 px-4 max-w-md">
                        <p className="text-[11.5px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {topScoreObj?.summary || 'AI evaluation complete.'}
                        </p>
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
                        >
                          <Info className="h-3 w-3" />
                          <span>View Scorecard</span>
                        </button>
                      </td>

                      {/* Selection Email & Voice Interview Status */}
                      <td className="py-4 px-4">
                        {outreach?.sent || isQualified ? (
                          <div className="space-y-1">
                            <Badge className="bg-emerald-500 text-white border-emerald-600 text-[10px] px-2 py-0.5 font-bold gap-1 shadow-xs">
                              <CheckCircle2 className="h-3 w-3" />
                              AUTO SELECTION EMAIL SENT
                            </Badge>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                              Sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{candidate.email}</span>
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                candidate.emailOutreach = outreach;
                                setViewEmailCandidate(candidate);
                              }}
                              className="h-7 text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 gap-1 rounded-xl border-indigo-200 dark:border-indigo-900/60"
                            >
                              <Mail className="h-3 w-3" />
                              <span>View Sent Email</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[11px] text-slate-400 italic block">Below Cutoff ({score}%)</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendOrResendEmail(candidate)}
                              className="h-7 text-[10px] font-bold text-indigo-600 gap-1 rounded-lg"
                            >
                              <Send className="h-3 w-3" />
                              <span>Send Selection Email</span>
                            </Button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isQualified && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setOfferCandidate(candidate)}
                              className="h-8 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 rounded-xl gap-1 hover:bg-emerald-100"
                              title="Generate formal employment offer letter"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Offer Letter</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === candidate.id}
                            onClick={() => handleDelete(candidate.id)}
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl"
                            title="Delete candidate data (GDPR request)"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* OFFER LETTER MODAL */}
      {offerCandidate && (
        <OfferLetterDialog
          candidate={offerCandidate}
          open={!!offerCandidate}
          onOpenChange={(open) => {
            if (!open) setOfferCandidate(null);
          }}
          onOfferSent={() => {
            onRefresh?.();
          }}
        />
      )}

      {/* VIEW AUTOMATED SELECTION EMAIL MODAL */}
      {viewEmailCandidate && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    Automated Candidate Selection Email
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatched automatically upon resume ATS match qualification
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-500 text-white font-bold text-xs gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> SENT & DELIVERED
              </Badge>
            </div>

            {/* Email Target & Dispatch Controls */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <span className="font-semibold text-slate-500">Send Test Email To:</span>
                <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                  <Input
                    type="email"
                    value={customRecipientEmail || viewEmailCandidate.email}
                    onChange={(e) => setCustomRecipientEmail(e.target.value)}
                    placeholder="Enter recipient email..."
                    className="h-8 text-xs bg-white dark:bg-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                <span className="font-semibold text-slate-400">From Recruiter:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">ApplyAI Talent Acquisition &lt;careers@applyai.com&gt;</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Subject:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  {viewEmailCandidate.emailOutreach?.subject || `Congratulations! You are selected for Next Round — Senior Full Stack Engineer at ApplyAI Corp`}
                </span>
              </div>
            </div>

            {/* Real Delivery Banner */}
            {emailDeliveryStatus && (
              <div className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-1.5 ${
                emailDeliveryStatus.mode === 'REAL_SMTP'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{emailDeliveryStatus.message}</span>
                </div>
                {emailDeliveryStatus.previewUrl && (
                  <a
                    href={emailDeliveryStatus.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 underline hover:text-amber-800"
                  >
                    <span>🔗 Open Live Web Email Preview (Ethereal)</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Email Body Card */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900/50 p-6 space-y-4">
              <div className="space-y-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                <p className="font-bold text-base text-slate-900 dark:text-white">
                  Dear {viewEmailCandidate.name},
                </p>
                <p>
                  Congratulations! We reviewed your resume for the position of{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    {viewEmailCandidate.emailOutreach?.jobRole || 'Senior Full Stack Engineer'}
                  </strong>{' '}
                  at <strong className="text-slate-900 dark:text-white">{viewEmailCandidate.emailOutreach?.companyName || 'ApplyAI Corp'}</strong>.
                </p>
                <p>
                  Based on your strong qualifications and ATS match score ({viewEmailCandidate.scores[0]?.overallScore || 85}%), you have been selected for the <strong className="text-emerald-600 dark:text-emerald-400">Next Round — AI Voice Technical Screening Interview</strong>.
                </p>

                {/* Details Box */}
                <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 text-xs shadow-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                    Interview Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-slate-400 text-[10px]">Role</p>
                      <p className="font-bold text-slate-900 dark:text-white">{viewEmailCandidate.emailOutreach?.jobRole || 'Senior Full Stack Engineer'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Date & Time</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{viewEmailCandidate.emailOutreach?.scheduledTime || 'Next Tuesday at 10:00 AM'}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-slate-400 text-[10px] mb-1">AI Voice Interview Link</p>
                    <a
                      href={viewEmailCandidate.emailOutreach?.interviewLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700"
                    >
                      <span>{viewEmailCandidate.emailOutreach?.interviewLink || `http://localhost:3001/interview-prep?candidate=${viewEmailCandidate.id}`}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <p>
                  Please click the link above at the scheduled time to complete your 15-minute voice interview session.
                </p>
                <p className="pt-2 text-xs text-slate-500">
                  Best regards,<br />
                  <strong className="text-slate-900 dark:text-white">ApplyAI Talent Acquisition Team</strong>
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(viewEmailCandidate.emailOutreach?.interviewLink || '');
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                  toast({ title: 'Link Copied', description: 'AI voice interview link copied to clipboard.' });
                }}
                className="text-xs rounded-xl gap-1.5 w-full sm:w-auto"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Interview Link'}</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  size="sm"
                  disabled={isSendingRealEmail}
                  onClick={() => handleSendOrResendEmail(viewEmailCandidate, customRecipientEmail)}
                  className="text-xs rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {isSendingRealEmail ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Real Email Now</span>
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewEmailCandidate(null);
                    setEmailDeliveryStatus(null);
                  }}
                  className="rounded-xl text-xs font-bold"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Scorecard Modal */}
      {selectedCandidate && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {selectedCandidate.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedCandidate.email}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {selectedCandidate.scores[0]?.overallScore || 0}% Match
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                  AI Summary
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {selectedCandidate.scores[0]?.summary || 'No summary recorded.'}
                </p>
              </div>

              {selectedCandidate.scores[0]?.strengths && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Key Strengths
                  </h4>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                    {selectedCandidate.scores[0].strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={() => setSelectedCandidate(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Close Scorecard
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
