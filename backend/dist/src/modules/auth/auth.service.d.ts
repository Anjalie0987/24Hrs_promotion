import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    }>;
}
