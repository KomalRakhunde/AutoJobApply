"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(data.password)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long and include uppercase, lowercase, a digit, and a special character.');
        }
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('An account with this email address already exists. Please sign in or use a different email.');
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const assignedRole = (data.role || 'student').toLowerCase();
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: assignedRole,
                },
            });
            return {
                message: 'Registration successful',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        }
        catch (err) {
            if (err?.code === 'P2002' || err?.message?.includes('P2002')) {
                throw new common_1.BadRequestException('An account with this email address already exists. Please sign in or use a different email.');
            }
            throw err;
        }
    }
    async login(email, password, selectedRole) {
        if (!selectedRole) {
            throw new common_1.BadRequestException('Selected role is required to authenticate.');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const normalizedUserRole = (user.role || 'student').toLowerCase();
        const normalizedSelectedRole = selectedRole.toLowerCase();
        if (normalizedUserRole !== normalizedSelectedRole) {
            throw new common_1.UnauthorizedException('Invalid credentials or incorrect role selected for this account.');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            message: 'Login successful',
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
    async validateOAuthUser(data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const requestedRole = (data.requestedRole || 'student').toLowerCase();
        let user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = await this.prisma.user.create({
                data: {
                    email: normalizedEmail,
                    password: randomPassword,
                    firstName: data.firstName || 'OAuth',
                    lastName: data.lastName || 'User',
                    role: requestedRole,
                },
            });
        }
        const verifiedRole = (user.role || requestedRole).toLowerCase();
        const token = this.jwtService.sign({
            sub: user.id,
            userId: user.id,
            email: user.email,
            role: verifiedRole,
            provider: data.provider,
        });
        return {
            message: 'OAuth authentication successful',
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: verifiedRole,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map