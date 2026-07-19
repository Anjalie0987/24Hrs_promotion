import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
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
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(id: string, data: {
        firstName?: string;
        lastName?: string;
        businessName?: string;
        businessDescription?: string;
        category?: string;
        location?: string;
        instagram?: string;
        whatsapp?: string;
        logo?: string;
        logoUrl?: string;
        bannerUrl?: string;
    }): Promise<{
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
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
