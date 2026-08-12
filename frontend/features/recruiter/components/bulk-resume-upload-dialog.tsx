'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';
import { uploadBulkResumes, RecruiterCandidate } from '@/services/recruiter/recruiter-api';

interface BulkResumeUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle?: string;
  onUploadSuccess?: (candidates: RecruiterCandidate[]) => void;
}

export function BulkResumeUploadDialog({
  open,
  onOpenChange,
  jobId,
  jobTitle = 'Selected Job',
  onUploadSuccess,
}: BulkResumeUploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleGenerateSampleFiles = () => {
    const samples = [
      {
        name: 'Komal_Rakhunde_Resume.pdf',
        content: `Komal Rakhunde\nEmail: komalrakhunde90@gmail.com\nPhone: +91 8421674532\nFull Stack & AI Engineer specializing in React, Next.js, NestJS, TypeScript, PostgreSQL, and LLMs. Experienced building enterprise ATS shortlisting engines.`,
      },
      {
        name: 'Sarah_Williams_FullStack.pdf',
        content: `Sarah Williams\nEmail: sarah.williams@techdev.org\nPhone: +1 555 0198\nFrontend Engineer specializing in React, Next.js, Tailwind CSS, REST APIs.`,
      },
      {
        name: 'David_Chen_AI_Developer.pdf',
        content: `David Chen\nEmail: david.chen@ai-innovations.io\nPhone: +1 555 0244\nBackend Engineer with Python, Docker, PostgreSQL experience.`,
      },
    ];

    const dummyFiles = samples.map(
      (s) => new File([s.content], s.name, { type: 'application/pdf' })
    );
    setFiles(dummyFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !jobId) return;

    setUploading(true);
    setStatusMessage('Parsing resumes & running AI ATS match scoring...');
    try {
      const res = await uploadBulkResumes(jobId, files);
      setStatusMessage(`Complete! Parsed ${res.count} candidate(s) successfully.`);
      onUploadSuccess?.(res.candidates);
      setTimeout(() => {
        setFiles([]);
        setStatusMessage(null);
        setUploading(false);
        onOpenChange(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage('Upload or AI scoring failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>BULK RESUME AI INTAKE</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Upload Candidates for {jobTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Upload multiple PDF/DOCX files or generate sample candidates for instant AI scoring.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drop resume files here
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports PDF, DOCX, TXT (up to 30 files per batch)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Quick Demo Sample Generator Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateSampleFiles}
              className="rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>⚡ One-Click Generate 5 Sample Candidate Resumes</span>
            </Button>
          </div>

          {/* Selected File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Selected Files ({files.length})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiles([])}
                  className="h-6 text-[10px] text-rose-500 hover:text-rose-600"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-1.5">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    {!uploading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Channel Auto-Outreach Configuration */}
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-slate-50 dark:bg-slate-800/40 p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Auto-Trigger Next Round Outreach Channels</span>
              <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]">
                ON MATCH QUALIFIED
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              When ATS score ≥ threshold %, automatically send Next Round interview link via:
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 font-medium text-slate-700 dark:text-slate-300 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600" />
                <span>📧 Email (SendGrid / SMTP)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600" />
                <span>💬 WhatsApp (Twilio)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600" />
                <span>🔗 LinkedIn InMail</span>
              </label>
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 p-3 text-xs text-indigo-700 dark:text-indigo-300 font-medium animate-pulse">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0 text-indigo-600" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
            className="rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 font-bold"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing AI Intake...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Parse & Score {files.length > 0 ? `${files.length} File(s)` : ''}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
