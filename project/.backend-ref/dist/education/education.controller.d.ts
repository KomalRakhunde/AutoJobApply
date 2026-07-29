import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
export declare class EducationController {
    private readonly educationService;
    constructor(educationService: EducationService);
    create(userId: string, dto: CreateEducationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        degree: string;
        field: string | null;
        institute: string | null;
        startYear: number | null;
        endYear: number | null;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        degree: string;
        field: string | null;
        institute: string | null;
        startYear: number | null;
        endYear: number | null;
    }[]>;
    update(id: string, dto: UpdateEducationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        degree: string;
        field: string | null;
        institute: string | null;
        startYear: number | null;
        endYear: number | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
