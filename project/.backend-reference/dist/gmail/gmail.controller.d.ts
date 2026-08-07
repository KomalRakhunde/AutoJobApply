import { GmailService, SyncedEmail } from './gmail.service';
export declare class GmailController {
    private readonly gmailService;
    constructor(gmailService: GmailService);
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
