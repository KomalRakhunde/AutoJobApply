import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
}
