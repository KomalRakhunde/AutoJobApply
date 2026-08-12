import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        location: string | null;
        githubUrl: string | null;
        portfolioUrl: string | null;
        phone: string | null;
        preferredLocation: string | null;
        expectedSalary: string | null;
        noticePeriod: string | null;
        linkedinUrl: string | null;
    } | {
        id: string;
        userId: string;
        phone: any;
        location: any;
        preferredLocation: any;
        expectedSalary: any;
        noticePeriod: any;
        linkedinUrl: any;
        portfolioUrl: any;
        githubUrl: any;
        createdAt: string;
        updatedAt: string;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        location: string | null;
        githubUrl: string | null;
        portfolioUrl: string | null;
        phone: string | null;
        preferredLocation: string | null;
        expectedSalary: string | null;
        noticePeriod: string | null;
        linkedinUrl: string | null;
    } | {
        id: string;
        userId: string;
        phone: string;
        location: string;
        preferredLocation: string;
        expectedSalary: string;
        noticePeriod: string;
        linkedinUrl: string;
        portfolioUrl: string;
        githubUrl: string;
        createdAt: string;
        updatedAt: string;
    }>;
}
