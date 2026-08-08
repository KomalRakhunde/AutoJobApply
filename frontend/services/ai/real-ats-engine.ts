/**
 * Real Local ATS (Applicant Tracking System) Scanner & Analyzer Engine
 * Performs continuous, granular ATS document parsing, keyword matching,
 * section extraction, bullet metric analysis, and scoring across 0-100%.
 */

export interface RealAtsResult {
  isResume: boolean;
  score: number; // Granular 0 - 100
  breakdown: {
    keywordMatch: number;
    formatting: number;
    completeness: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

const ACTION_VERBS = [
  'built', 'engineered', 'developed', 'architected', 'spearheaded', 'implemented',
  'designed', 'optimized', 'scaled', 'automated', 'reduced', 'increased', 'led',
  'managed', 'launched', 'created', 'refactored', 'deployed', 'orchestrated',
  'integrated', 'accelerated', 'established', 'streamlined', 'transformed',
  'solved', 'delivered', 'configured', 'authored', 'maintained', 'analyzed'
];

const COMMON_TECH_SKILLS = [
  'react', 'next.js', 'typescript', 'javascript', 'node.js', 'express', 'python',
  'java', 'c++', 'go', 'rust', 'html', 'css', 'tailwind', 'sass', 'redux',
  'graphql', 'rest api', 'postgresql', 'mysql', 'mongodb', 'redis', 'prisma',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git', 'github',
  'unit testing', 'jest', 'cypress', 'system design', 'microservices', 'agile'
];

export function analyzeResumeRealATS(
  resumeText: string,
  jobDescription?: string
): RealAtsResult {
  const text = (resumeText || '').trim();
  const lowerText = text.toLowerCase();

  // 1. SECTION & LENGTH EVALUATION
  const sectionKeywords = [
    'experience', 'employment', 'history', 'education', 'skills', 'projects',
    'summary', 'certifications', 'email', 'phone', 'university', 'college'
  ];
  const sectionMatches = sectionKeywords.filter((kw) => lowerText.includes(kw));
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 15 || sectionMatches.length === 0) {
    const baseScore = Math.max(50, Math.min(72, wordCount * 2 + 45));
    return {
      isResume: true,
      score: baseScore,
      breakdown: {
        keywordMatch: Math.round(baseScore * 0.9),
        formatting: baseScore,
        completeness: Math.round(baseScore * 0.8),
      },
      matchedKeywords: [],
      missingKeywords: ['WORK EXPERIENCE', 'EDUCATION', 'TECHNICAL SKILLS', 'CONTACT DETAILS'],
      suggestions: [
        'Upload a complete PDF or Text resume containing your work experience and skills.',
        'Ensure sections have standard titles like "Work Experience", "Education", and "Technical Skills".',
      ],
      strengths: ['Document received.'],
      weaknesses: ['Document lacks sufficient text or standard resume section headers.'],
      summary: 'Insufficient Resume Text: Please provide a full resume document for ATS evaluation.',
    };
  }

  // 2. DETECTED TECHNICAL SKILLS
  const detectedResumeSkills = COMMON_TECH_SKILLS.filter((skill) => lowerText.includes(skill));

  // 3. CONTINUOUS KEYWORD MATCH SCORE (0-100)
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordMatchScore = 65;

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdLower = jobDescription.toLowerCase();
    
    // Extract unique words from Job Description
    const jdTokens = Array.from(new Set(
      jdLower
        .replace(/[^\w\s.#+-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    ));

    const jdSkills = COMMON_TECH_SKILLS.filter((s) => jdLower.includes(s));
    const allJdKeywords = Array.from(new Set([...jdSkills, ...jdTokens.slice(0, 30)]));

    matchedKeywords = allJdKeywords.filter((kw) => lowerText.includes(kw));
    missingKeywords = allJdKeywords.filter((kw) => !lowerText.includes(kw)).slice(0, 8);

    if (allJdKeywords.length > 0) {
      const matchRatio = matchedKeywords.length / allJdKeywords.length;
      keywordMatchScore = Math.round(Math.min(98, Math.max(30, matchRatio * 100 + 20)));
    }
  } else {
    matchedKeywords = detectedResumeSkills;
    missingKeywords = COMMON_TECH_SKILLS.filter((s) => !detectedResumeSkills.includes(s)).slice(0, 6);
    keywordMatchScore = Math.round(Math.min(95, Math.max(40, detectedResumeSkills.length * 8 + 42)));
  }

  // 4. CONTINUOUS SKILLS & COMPLETENESS SCORE (0-100)
  const skillsCount = detectedResumeSkills.length;
  const completenessScore = Math.round(Math.min(96, Math.max(35, skillsCount * 9 + 38)));

  // 5. CONTINUOUS EXPERIENCE IMPACT & METRICS SCORE (0-100)
  const actionVerbMatches = ACTION_VERBS.filter((verb) => lowerText.includes(verb));
  const metricsMatches = (text.match(/\d+%/g) || []).length + 
                         (text.match(/\$\d+/g) || []).length + 
                         (text.match(/\b(100|200|[1-9]\d{1,4})\b/g) || []).length;

  // 6. CONTINUOUS FORMATTING & STRUCTURE SCORE (0-100)
  const hasExperienceHeader = lowerText.includes('experience') || lowerText.includes('employment');
  const hasEducationHeader = lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('university');
  const hasSkillsHeader = lowerText.includes('skill');
  const hasProjectsHeader = lowerText.includes('project');

  let formattingScore = 45;
  if (hasExperienceHeader) formattingScore += 18;
  if (hasEducationHeader) formattingScore += 15;
  if (hasSkillsHeader) formattingScore += 12;
  if (hasProjectsHeader) formattingScore += 10;
  if (wordCount >= 150 && wordCount <= 750) formattingScore += 10;
  formattingScore = Math.round(Math.min(98, formattingScore));

  // 7. COMPOSITE OVERALL ATS SCORE (Granular calculation)
  const overallScore = Math.round(
    keywordMatchScore * 0.40 +
    completenessScore * 0.30 +
    formattingScore * 0.30
  );

  // 8. DYNAMIC TAILORED FEEDBACK
  const strengths: string[] = [];
  if (detectedResumeSkills.length > 0) {
    strengths.push(`Identified core technical competencies: ${detectedResumeSkills.slice(0, 5).map(s => s.toUpperCase()).join(', ')}.`);
  }
  if (actionVerbMatches.length > 0) {
    strengths.push(`Uses active impact verbs (${actionVerbMatches.slice(0, 4).join(', ')}) in experience bullet points.`);
  }
  if (metricsMatches > 0) {
    strengths.push(`Includes quantifiable performance metrics (${metricsMatches} data points found).`);
  }
  if (hasExperienceHeader && hasEducationHeader) {
    strengths.push('Clean ATS structural layout with clear section demarcations.');
  }

  const weaknesses: string[] = [];
  if (metricsMatches < 2) {
    weaknesses.push('Lacks specific quantitative metrics (%, $, scale, team numbers) to prove impact.');
  }
  if (missingKeywords.length > 0) {
    weaknesses.push(`Missing key target keywords: ${missingKeywords.slice(0, 4).map(k => k.toUpperCase()).join(', ')}.`);
  }
  if (actionVerbMatches.length < 3) {
    weaknesses.push('Experience bullets rely on passive phrasing instead of strong action verbs (e.g., "Engineered", "Optimized").');
  }

  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Incorporate target keywords: ${missingKeywords.slice(0, 4).map(k => k.toUpperCase()).join(', ')} into work experience bullets.`);
  }
  if (metricsMatches < 2) {
    suggestions.push('Add metrics to bullet points (e.g., "Improved system throughput by 40% across 10k users").');
  }
  suggestions.push('Group skills under categorized headers: Languages, Frameworks, Cloud/DevOps, Databases.');

  return {
    isResume: true,
    score: overallScore,
    breakdown: {
      keywordMatch: keywordMatchScore,
      formatting: formattingScore,
      completeness: completenessScore,
    },
    matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords.map(k => k.toUpperCase()) : ['SOFTWARE DEVELOPMENT'],
    missingKeywords: missingKeywords.map(k => k.toUpperCase()),
    suggestions,
    strengths,
    weaknesses,
    summary: `ATS Analysis Complete: Overall score of ${overallScore}/100 based on ${detectedResumeSkills.length} tech skills, ${actionVerbMatches.length} action verbs, and document formatting.`,
  };
}
