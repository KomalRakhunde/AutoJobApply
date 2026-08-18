export interface JobJD {
  role: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number;
  educational_requirements: string[];
  responsibilities: string[];
}

export interface Experience {
  company_name: string;
  role: string;
  duration: string;
  description: string;
  skills_used: string[];
}

export interface ResumeProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface ResumeCertification {
  name: string;
  issuer?: string;
  year?: string;
}

export interface Resume {
  name: string | null;
  email: string | null;
  phone_number: string | null;
  total_experience_years: number;
  skills: string[];
  experiences: Experience[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
}

export interface MatchResult {
  score: number;
  candidate_name: string;
  matching_skills: string[];
  missing_critical_skills: string[];
  experience_requirement_met: boolean;
  short_final_verdict: string;
}

export function validateJobJD(data: any): JobJD {
  if (!data || typeof data !== 'object') {
    return {
      role: 'Software Engineer',
      required_skills: [],
      preferred_skills: [],
      minimum_experience: 0,
      educational_requirements: [],
      responsibilities: [],
    };
  }

  return {
    role: typeof data.role === 'string' && data.role.trim() ? data.role.trim() : 'Software Engineer',
    required_skills: Array.isArray(data.required_skills) ? data.required_skills.map(String) : [],
    preferred_skills: Array.isArray(data.preferred_skills) ? data.preferred_skills.map(String) : [],
    minimum_experience: typeof data.minimum_experience === 'number' && !isNaN(data.minimum_experience) ? Math.max(0, data.minimum_experience) : 0,
    educational_requirements: Array.isArray(data.educational_requirements) ? data.educational_requirements.map(String) : [],
    responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities.map(String) : [],
  };
}

export function validateResume(data: any): Resume {
  if (!data || typeof data !== 'object') {
    return {
      name: null,
      email: null,
      phone_number: null,
      total_experience_years: 0,
      skills: [],
      experiences: [],
      projects: [],
      certifications: [],
    };
  }

  const experiences = Array.isArray(data.experiences)
    ? data.experiences.map((e: any) => ({
        company_name: String(e?.company_name || e?.company || 'Unknown Company'),
        role: String(e?.role || 'Engineer'),
        duration: String(e?.duration || ''),
        description: String(e?.description || ''),
        skills_used: Array.isArray(e?.skills_used) ? e.skills_used.map(String) : [],
      }))
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects.map((p: any) => ({
        title: String(p?.title || p?.name || 'Project'),
        description: String(p?.description || ''),
        technologies: Array.isArray(p?.technologies) ? p.technologies.map(String) : [],
      }))
    : [];

  const certifications = Array.isArray(data.certifications)
    ? data.certifications.map((c: any) => ({
        name: String(c?.name || c || 'Certification'),
        issuer: c?.issuer ? String(c.issuer) : undefined,
        year: c?.year ? String(c.year) : undefined,
      }))
    : [];

  return {
    name: data.name ? String(data.name).trim() : null,
    email: data.email ? String(data.email).trim() : null,
    phone_number: data.phone_number || data.phone ? String(data.phone_number || data.phone).trim() : null,
    total_experience_years: typeof data.total_experience_years === 'number' && !isNaN(data.total_experience_years) ? Math.max(0, data.total_experience_years) : 0,
    skills: Array.isArray(data.skills) ? data.skills.map(String) : [],
    experiences,
    projects,
    certifications,
  };
}

export function validateMatchResult(data: any, candidateFallbackName: string = 'Candidate'): MatchResult {
  if (!data || typeof data !== 'object') {
    return {
      score: 75,
      candidate_name: candidateFallbackName,
      matching_skills: [],
      missing_critical_skills: [],
      experience_requirement_met: true,
      short_final_verdict: 'Candidate evaluated against job description requirements.',
    };
  }

  let rawScore = typeof data.score === 'number' ? data.score : parseInt(String(data.score), 10);
  if (isNaN(rawScore)) rawScore = 75;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    score,
    candidate_name: data.candidate_name ? String(data.candidate_name) : candidateFallbackName,
    matching_skills: Array.isArray(data.matching_skills) ? data.matching_skills.map(String) : [],
    missing_critical_skills: Array.isArray(data.missing_critical_skills) ? data.missing_critical_skills.map(String) : [],
    experience_requirement_met: typeof data.experience_requirement_met === 'boolean' ? data.experience_requirement_met : true,
    short_final_verdict: data.short_final_verdict ? String(data.short_final_verdict) : 'Evaluated candidate fit against job requirements.',
  };
}
