'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Briefcase,
  Loader2,
  X,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiJdGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate?: (data: { title: string; description: string; requirements: string }) => void;
}

export function AiJdGeneratorDialog({
  open,
  onOpenChange,
  onUseTemplate,
}: AiJdGeneratorDialogProps) {
  const { toast } = useToast();

  const [jobTitleInput, setJobTitleInput] = useState('Senior Full Stack Engineer');
  const [level, setLevel] = useState('Senior (5+ Years)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedDesc, setGeneratedDesc] = useState(
    'We are seeking a high-performing Senior Full Stack Engineer to lead technical architecture and build scalable microservices using TypeScript, Next.js, and Node.js.'
  );

  const [generatedReqs, setGeneratedReqs] = useState(
    '• 5+ years of software engineering experience with React, Next.js, and Node.js.\n• Mastery of TypeScript, PostgreSQL, and RESTful API architecture.\n• Demonstrated experience with automated CI/CD pipelines, Docker, and AWS/Cloud deployments.\n• Strong problem solving skills and passion for high quality clean code.'
  );

  if (!open) return null;

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedDesc(
        `We are looking for an exceptional ${jobTitleInput} (${level}) to join our engineering team. You will drive end-to-end product development, build scalable backend services, and collaborate with cross-functional teams.`
      );
      setGeneratedReqs(
        `• Proven background as a ${jobTitleInput} delivering production web applications.\n• Deep expertise in modern frontend & backend frameworks (TypeScript, React/Next.js, Node.js).\n• Strong understanding of database optimization (PostgreSQL/MongoDB) and system design.\n• Experience with agile methodologies, code reviews, and automated testing.`
      );
      toast({
        title: '✨ AI Job Description Generated!',
        description: `Drafted tailored requirements for ${jobTitleInput}.`,
      });
    }, 1000);
  };

  const handleApplyToJobForm = () => {
    onUseTemplate?.({
      title: jobTitleInput,
      description: generatedDesc,
      requirements: generatedReqs,
    });
    onOpenChange(false);
  };

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Job Description Generator</span>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold">
                  AI Writer
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Instantly draft tailored job titles, descriptions, and skill requirements.
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

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-slate-500 font-semibold">Target Job Role / Title</Label>
            <Input
              value={jobTitleInput}
              onChange={(e) => setJobTitleInput(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="h-9 text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 font-semibold">Seniority Level</Label>
            <Input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g. Senior (5+ yrs)"
              className="h-9 text-xs font-semibold"
            />
          </div>
        </div>

        <Button
          onClick={handleGenerateAI}
          disabled={isGenerating || !jobTitleInput.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl h-10 text-xs gap-2 shadow-md"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>{isGenerating ? 'Drafting Job Description...' : 'Generate Tailored Job Description'}</span>
        </Button>

        {/* Output Previews */}
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-slate-500 font-semibold">Role Summary</Label>
            <Textarea
              value={generatedDesc}
              onChange={(e) => setGeneratedDesc(e.target.value)}
              rows={3}
              className="text-xs bg-slate-50 dark:bg-slate-800/60"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 font-semibold">Skill Requirements & Expectations</Label>
            <Textarea
              value={generatedReqs}
              onChange={(e) => setGeneratedReqs(e.target.value)}
              rows={5}
              className="text-xs bg-slate-50 dark:bg-slate-800/60 font-mono"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleApplyToJobForm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-6 gap-2 shadow-md shadow-emerald-600/20"
          >
            <Zap className="h-4 w-4" />
            <span>Use AI Template for Job Posting</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
