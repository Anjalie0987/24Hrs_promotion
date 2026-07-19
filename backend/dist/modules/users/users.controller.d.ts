import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: AuthenticatedRequest): Promise<{
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
    updateProfile(req: AuthenticatedRequest, data: Parameters<UsersService['updateProfile']>[1]): Promise<{
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
