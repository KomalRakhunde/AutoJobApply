import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
    }>;
    login(body: {
        email: string;
        password: string;
        selectedRole: string;
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    oauth(body: {
        email: string;
        firstName?: string;
        lastName?: string;
        requestedRole?: string;
        provider: 'google' | 'linkedin';
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
    }>;
}
