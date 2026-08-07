import { Injectable } from '@nestjs/common';

export interface SyncedEmail {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  date: string;
  snippet: string;
  category: 'interview' | 'offer' | 'assessment' | 'rejection' | 'general';
  parsedCompany?: string;
  parsedRole?: string;
  parsedDate?: string;
}

@Injectable()
export class GmailService {
  private emails: SyncedEmail[] = [
    {
      id: 'email-1',
      fromName: 'TechCorp Talent Acquisition',
      fromEmail: 'careers@techcorp.com',
      subject: 'Interview Invitation: Senior Full Stack Engineer at TechCorp',
      date: 'Today, 2:15 PM',
      snippet: 'Hi, We reviewed your application and would love to schedule a 45-minute technical interview with our engineering lead next Tuesday...',
      category: 'interview',
      parsedCompany: 'TechCorp',
      parsedRole: 'Senior Full Stack Engineer',
      parsedDate: 'Next Tuesday, 10:00 AM',
    },
    {
      id: 'email-2',
      fromName: 'Innovate AI Recruiting',
      fromEmail: 'jobs@innovateai.com',
      subject: 'Offer Letter — Frontend Engineer Position',
      date: 'Yesterday',
      snippet: 'Dear candidate, Congratulations! We are thrilled to extend a formal offer of employment for the Frontend Engineer position at Innovate AI...',
      category: 'offer',
      parsedCompany: 'Innovate AI',
      parsedRole: 'Frontend Engineer',
    },
    {
      id: 'email-3',
      fromName: 'DataPulse HR',
      fromEmail: 'hr@datapulse.io',
      subject: 'Coding Assessment Instructions: AI Systems Engineer',
      date: '3 days ago',
      snippet: 'Thank you for applying. Please complete the following 90-minute coding challenge on Hackerrank within 48 hours...',
      category: 'assessment',
      parsedCompany: 'DataPulse AI',
      parsedRole: 'AI Systems Engineer',
      parsedDate: 'Complete within 48h',
    },
    {
      id: 'email-4',
      fromName: 'Global Soft',
      fromEmail: 'no-reply@globalsoft.com',
      subject: 'Application Status Update — Software Developer',
      date: '4 days ago',
      snippet: 'Thank you for your interest in Global Soft. After careful review, we have decided to move forward with other candidates whose experience more closely matches...',
      category: 'rejection',
      parsedCompany: 'Global Soft',
      parsedRole: 'Software Developer',
    },
  ];

  getEmails(): SyncedEmail[] {
    return this.emails;
  }

  syncInbox(): { count: number; newEmail: SyncedEmail } {
    const companies = ['Stripe', 'Google', 'Meta', 'Netflix', 'Airbnb', 'Microsoft', 'Amazon'];
    const roles = ['Full Stack Engineer', 'Backend Developer', 'AI/ML Engineer', 'Software Architect'];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    const newEmail: SyncedEmail = {
      id: `email-${Date.now()}`,
      fromName: `${randomCompany} Talent Team`,
      fromEmail: `recruiting@${randomCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      subject: `Interview Invitation: ${randomRole} at ${randomCompany}`,
      date: 'Just now',
      snippet: `Hi there! We reviewed your profile and application for ${randomRole} at ${randomCompany} and would love to schedule an introductory technical round.`,
      category: 'interview',
      parsedCompany: randomCompany,
      parsedRole: randomRole,
      parsedDate: 'Tomorrow, 2:00 PM',
    };

    this.emails.unshift(newEmail);
    return { count: 1, newEmail };
  }

  addEmail(dto: Omit<SyncedEmail, 'id' | 'date'>): SyncedEmail {
    const newEmail: SyncedEmail = {
      ...dto,
      id: `email-${Date.now()}`,
      date: 'Just now',
    };
    this.emails.unshift(newEmail);
    return newEmail;
  }

  deleteEmail(id: string): { message: string } {
    this.emails = this.emails.filter((e) => e.id !== id);
    return { message: 'Email deleted successfully' };
  }
}
