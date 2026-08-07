import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(userId: string, dto: CreateSkillDto): import(".prisma/client").Prisma.Prisma__SkillClient<{
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
    }[]>;
    update(id: string, dto: UpdateSkillDto): Promise<{
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
