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
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';
import { uploadBulkResumes, RecruiterCandidate } from '@/lib/recruiter-api';

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
      <DialogContent className="max-w-lg rounded-2xl p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>BULK RESUME AI INTAKE</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Upload Candidates for {jobTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Upload multiple PDF/DOCX files. AI will parse metadata, extract skills, and compute match scores against job requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
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
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5"
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
