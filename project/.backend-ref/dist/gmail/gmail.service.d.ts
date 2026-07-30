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
export declare class GmailService {
    private emails;
    getEmails(): SyncedEmail[];
    syncInbox(): {
        count: number;
        newEmail: SyncedEmail;
    };
    addEmail(dto: Omit<SyncedEmail, 'id' | 'date'>): SyncedEmail;
    deleteEmail(id: string): {
        message: string;
    };
}
