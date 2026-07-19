import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    private generateOtp;
    sendSignupOtp(data: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    verifySignupOtp(data: {
        email: string;
        otp: string;
    }): Promise<{
        verified: boolean;
    }>;
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
            isEmailVerified: boolean;
        };
    }>;
    forgotPassword(data: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(data: {
        email: string;
        otp: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
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
            isEmailVerified: true;
            business: ({
                banners: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    originalImageUrl: string;
                    watermarkedImageUrl: string | null;
                    title: string | null;
                    businessId: string;
                }[];
            } & {
                name: string;
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                bannerTemplate: string | null;
                trustScore: number;
                website: string | null;
                isVerified: boolean;
                city: string | null;
                state: string | null;
                isAvailable: boolean;
                ownerName: string | null;
                ownerPhotoUrl: string | null;
                yearsExperience: number | null;
                userId: string;
            }) | null;
        };
    }>;
}
