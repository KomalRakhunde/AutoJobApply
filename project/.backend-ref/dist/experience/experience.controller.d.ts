import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
export declare class ExperienceController {
    private readonly experienceService;
    constructor(experienceService: ExperienceService);
    create(userId: string, dto: CreateExperienceDto): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        company: string;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        company: string;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }[]>;
    update(id: string, dto: UpdateExperienceDto): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        company: string;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
