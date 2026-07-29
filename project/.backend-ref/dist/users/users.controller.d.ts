import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, body: {
        firstName?: string;
        lastName?: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
