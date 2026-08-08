'use client';

import { useState, useEffect } from 'react';

const PINNED_STORAGE_KEY = 'applyai_pinned_features';

export interface PinnedFeatureInfo {
  id: string;
  href: string;
  label: string;
  description: string;
  iconName: string;
}

export const ALL_PINNABLE_FEATURES: PinnedFeatureInfo[] = [
  {
    id: 'resume',
    href: '/resume',
    label: 'Resume & ATS Analysis',
    description: 'Instant ATS score check, keyword optimization & resume audit',
    iconName: 'Target',
  },
  {
    id: 'jobs',
    href: '/jobs',
    label: 'Job Search & Matching',
    description: 'AI matched job postings filtered by your skills & salary target',
    iconName: 'Briefcase',
  },
  {
    id: 'applications',
    href: '/applications',
    label: 'Application Tracker',
    description: 'Kanban pipeline tracker for job applications and interview stages',
    iconName: 'KanbanSquare',
  },
  {
    id: 'auto-apply',
    href: '/auto-apply',
    label: 'Auto-Apply Engine',
    description: 'Automated job application bot matching your criteria',
    iconName: 'Zap',
  },
  {
    id: 'cover-letter',
    href: '/cover-letter',
    label: 'Cover Letter Generator',
    description: 'AI tailored cover letters for specific job roles and companies',
    iconName: 'FileText',
  },
  {
    id: 'interview-prep',
    href: '/interview-prep',
    label: 'Interview Studio',
    description: 'AI mock questions, behavioral prep, and technical practice',
    iconName: 'MessageSquare',
  },
  {
    id: 'career-coach',
    href: '/career-coach',
    label: 'AI Career Coach',
    description: 'Career roadmap, missing skills analysis & course recommendations',
    iconName: 'Compass',
  },
  {
    id: 'email-sync',
    href: '/email-sync',
    label: 'Email Inbox AI',
    description: 'Automated background scanner for interview invites & offers',
    iconName: 'Mail',
  },
];

export function getStoredPinnedFeatures(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredPinnedFeatures(pins: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pins));
    window.dispatchEvent(new Event('applyai_pins_changed'));
  }
}

export function usePinnedFeatures() {
  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>([]);

  useEffect(() => {
    setPinnedHrefs(getStoredPinnedFeatures());

    const handleStorageChange = () => {
      setPinnedHrefs(getStoredPinnedFeatures());
    };

    window.addEventListener('applyai_pins_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('applyai_pins_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const togglePin = (href: string) => {
    const current = getStoredPinnedFeatures();
    let updated: string[];
    if (current.includes(href)) {
      updated = current.filter((h) => h !== href);
    } else {
      updated = [...current, href];
    }
    saveStoredPinnedFeatures(updated);
    setPinnedHrefs(updated);
  };

  const isPinned = (href: string) => pinnedHrefs.includes(href);

  const clearAllPins = () => {
    saveStoredPinnedFeatures([]);
    setPinnedHrefs([]);
  };

  return {
    pinnedHrefs,
    togglePin,
    isPinned,
    clearAllPins,
    hasPins: pinnedHrefs.length > 0,
  };
}
