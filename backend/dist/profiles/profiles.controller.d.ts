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
        phone: string | null;
        preferredLocation: string | null;
        expectedSalary: string | null;
        noticePeriod: string | null;
        linkedinUrl: string | null;
        portfolioUrl: string | null;
        githubUrl: string | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        location: string | null;
        phone: string | null;
        preferredLocation: string | null;
        expectedSalary: string | null;
        noticePeriod: string | null;
        linkedinUrl: string | null;
        portfolioUrl: string | null;
        githubUrl: string | null;
    }>;
}
