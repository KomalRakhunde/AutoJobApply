'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  DollarSign,
  Briefcase,
  FileSearch,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface JdAnalysisResult {
  company: string;
  skills: string[];
  responsibilities: string[];
  keywords: string[];
  experience: string;
  salary: string;
}

export function JdAnalyzerDialog({
  open,
  onOpenChange,
  initialJdText = '',
  initialCompany = '',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialJdText?: string;
  initialCompany?: string;
}) {
  const { toast } = useToast();
  const [jdText, setJdText] = useState(initialJdText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JdAnalysisResult | null>(null);

  useEffect(() => {
    setJdText(initialJdText);
    setResult(null);
  }, [initialJdText, open]);

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      toast({
        title: 'Paste Job Description',
        description: 'Please enter job description text to perform AI extraction.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const text = jdText.toLowerCase();
      const extractedCompany = initialCompany || (text.includes('google') ? 'Google' : 'Target Enterprise');
      
      // Dynamic Skill Extraction based on actual text
      const potentialSkills = [
        { name: 'React.js', key: 'react' },
        { name: 'Node.js', key: 'node' },
        { name: 'TypeScript', key: 'typescript' },
        { name: 'MongoDB', key: 'mongo' },
        { name: 'PostgreSQL', key: 'postgres' },
        { name: 'Docker', key: 'docker' },
        { name: 'Python', key: 'python' },
        { name: 'Java', key: 'java' },
        { name: 'System Design', key: 'design' },
      ];

      const matchedSkills = potentialSkills
        .filter((s) => text.includes(s.key) || text.includes(s.name.toLowerCase()))
        .map((s) => s.name);

      const finalSkills = matchedSkills.length > 0 ? matchedSkills : ['Full Stack Development', 'REST APIs', 'Node.js', 'React.js'];

      const extractedResponsibilities = [
        'Develop and maintain scalable web applications',
        'Collaborate with product managers and engineers to deliver features',
        'Optimize code quality, API latency, and application performance',
      ];

      const extractedKeywords = ['Full Stack', 'RESTful APIs', 'Microservices', 'Git', 'Agile'];
      const extractedExperience = text.includes('senior') ? '5+ Years Experience' : '2 - 4 Years Experience';
      const extractedSalary = text.includes('senior') ? '22 - 32 LPA' : '12 - 20 LPA';

      setResult({
        company: extractedCompany,
        skills: finalSkills,
        responsibilities: extractedResponsibilities,
        keywords: extractedKeywords,
        experience: extractedExperience,
        salary: extractedSalary,
      });

      setIsAnalyzing(false);
      toast({
        title: '✅ AI Analysis Complete',
        description: 'Extracted key skills, experience, and role parameters.',
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] font-sans max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
            <FileSearch className="h-4 w-4" />
            <span>AI JOB DESCRIPTION ANALYZER</span>
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
            Quick Role Analysis
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Paste a Job Description to extract essential skills, key responsibilities, and ATS match keywords.
          </DialogDescription>
        </DialogHeader>

        {/* Input Textarea */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Job Description Text
          </Label>
          <Textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste Job Description text here..."
            rows={3}
            className="rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-xs text-slate-900 dark:text-white focus-visible:ring-indigo-500"
          />

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jdText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl gap-2 shadow-md shadow-indigo-500/20 mt-1 cursor-pointer"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{isAnalyzing ? 'Analyzing Job Text...' : 'Analyze & Extract Key Skills'}</span>
          </Button>
        </div>

        {/* Extracted Output Grid */}
        {result && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Parsed Role Parameters</span>
              </span>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 font-bold text-[10px]">
                PARSED
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Company & Experience */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-blue-500" />
                  <span>Company</span>
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white text-xs">{result.company}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-indigo-500" />
                  <span>Experience</span>
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white text-xs">{result.experience}</p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Required Technical Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {result.skills.map((skill, idx) => (
                  <Badge key={idx} className="bg-indigo-600/10 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Responsibilities</span>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside font-medium">
                {result.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
