import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
export declare class CertificationController {
    private readonly certificationService;
    constructor(certificationService: CertificationService);
    create(userId: string, dto: CreateCertificationDto): import(".prisma/client").Prisma.Prisma__CertificationClient<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        issuer: string | null;
        issueDate: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        issuer: string | null;
        issueDate: Date | null;
    }[]>;
    update(id: string, dto: UpdateCertificationDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        issuer: string | null;
        issueDate: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
