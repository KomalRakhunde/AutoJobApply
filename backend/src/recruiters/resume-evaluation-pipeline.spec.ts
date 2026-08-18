import { validateJobJD, validateResume, validateMatchResult } from './dto/resume-evaluation-schemas';

describe('AI Resume Evaluation Pipeline Schemas & Validators (Phases 1 - 5)', () => {
  it('Phase 1 & Phase 2: should validate structured JobJD JSON', () => {
    const rawAiOutput = {
      role: 'Senior Full Stack Engineer',
      required_skills: ['React', 'NestJS', 'PostgreSQL'],
      preferred_skills: ['Docker', 'AWS'],
      minimum_experience: 3,
      educational_requirements: ["Bachelor's in Computer Science"],
      responsibilities: ['Build backend services', 'Develop React UI components'],
    };

    const validated = validateJobJD(rawAiOutput);
    expect(validated.role).toBe('Senior Full Stack Engineer');
    expect(validated.required_skills).toContain('React');
    expect(validated.preferred_skills).toContain('Docker');
    expect(validated.minimum_experience).toBe(3);
  });

  it('Phase 4: should validate structured Resume JSON and calculate experience', () => {
    const rawResumeOutput = {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone_number: '+91 98765 43210',
      total_experience_years: 4,
      skills: ['Python', 'AWS', 'PostgreSQL', 'Docker'],
      experiences: [
        {
          company_name: 'Tech Corp',
          role: 'Backend Developer',
          duration: '2020 - 2024',
          description: 'Built scalable cloud microservices',
          skills_used: ['Python', 'AWS'],
        },
      ],
      projects: [],
      certifications: [],
    };

    const validated = validateResume(rawResumeOutput);
    expect(validated.name).toBe('Rahul Sharma');
    expect(validated.email).toBe('rahul.sharma@example.com');
    expect(validated.total_experience_years).toBe(4);
    expect(validated.skills).toContain('AWS');
  });

  it('Phase 5: should validate HR MatchResult with valid 0-100 score', () => {
    const rawMatchOutput = {
      score: 89,
      candidate_name: 'Rahul Sharma',
      matching_skills: ['Python', 'AWS', 'PostgreSQL', 'Docker'],
      missing_critical_skills: ['Kubernetes'],
      experience_requirement_met: true,
      short_final_verdict: 'Strong match because candidate meets technical skills and minimum 2+ years experience.',
    };

    const validated = validateMatchResult(rawMatchOutput, 'Rahul Sharma');
    expect(validated.score).toBe(89);
    expect(validated.score).toBeGreaterThanOrEqual(0);
    expect(validated.score).toBeLessThanOrEqual(100);
    expect(validated.matching_skills).toHaveLength(4);
    expect(validated.missing_critical_skills).toContain('Kubernetes');
    expect(validated.experience_requirement_met).toBe(true);
  });
});
