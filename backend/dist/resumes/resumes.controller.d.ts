import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
export declare class ResumesController {
    private readonly resumesService;
    constructor(resumesService: ResumesService);
    create(userId: string, dto: CreateResumeDto): import(".prisma/client").Prisma.Prisma__ResumeClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        fileUrl: string | null;
        atsScore: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        fileUrl: string | null;
        atsScore: string | null;
    }[]>;
    update(id: string, dto: UpdateResumeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        fileUrl: string | null;
        atsScore: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
