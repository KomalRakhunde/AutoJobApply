'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader2, Sparkles, Sliders, Bot, Clock } from 'lucide-react';
import { createRecruiterJob, RecruiterJob } from '@/lib/recruiter-api';

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreated?: (job: RecruiterJob) => void;
}

export function CreateJobDialog({ open, onOpenChange, onJobCreated }: CreateJobDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    passingThreshold: 75,
    autoInterviewEnabled: true,
    maxInterviewDurationMinutes: 10,
    description: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setLoading(true);
    try {
      const created = await createRecruiterJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        passingThreshold: formData.passingThreshold,
        autoInterviewEnabled: formData.autoInterviewEnabled,
        maxInterviewDurationSeconds: formData.maxInterviewDurationMinutes * 60,
        description: formData.description,
        requirements: formData.requirements || formData.description,
      });

      onJobCreated?.(created);
      onOpenChange(false);
      setFormData({
        title: '',
        department: 'Engineering',
        location: 'Remote',
        passingThreshold: 75,
        autoInterviewEnabled: true,
        maxInterviewDurationMinutes: 10,
        description: '',
        requirements: '',
      });
    } catch (err) {
      console.error('Failed to create job', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>NEW RECRUITMENT POSTING</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Create Job & Configure AI Voice Interview
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Define role requirements, auto-screening cutoff, and autonomous voice interview duration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Job Title *</Label>
              <Input
                placeholder="e.g. Senior Full Stack Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Department</Label>
              <Input
                placeholder="e.g. Engineering / Product"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">AI Passing Threshold (%)</Label>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {formData.passingThreshold}%
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Sliders className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={formData.passingThreshold}
                  onChange={(e) => setFormData({ ...formData, passingThreshold: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Max AI Interview Duration (Mins)</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <Input
                  type="number"
                  min="3"
                  max="30"
                  value={formData.maxInterviewDurationMinutes}
                  onChange={(e) => setFormData({ ...formData, maxInterviewDurationMinutes: Number(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Auto Interview Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/30">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Bot className="h-4 w-4 text-indigo-600" />
                <span>Auto-Trigger AI Voice Interview on Qualification</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Automatically send SendGrid Email & Twilio WhatsApp join link when score ≥ {formData.passingThreshold}%.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoInterviewEnabled}
              onChange={(e) => setFormData({ ...formData, autoInterviewEnabled: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Job Description *</Label>
            <Textarea
              placeholder="Describe role responsibilities and expectations..."
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Technical Requirements</Label>
            <Textarea
              placeholder="e.g. 5+ years React, Next.js App Router, NestJS, PostgreSQL..."
              rows={2}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Publish Job Posting</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
