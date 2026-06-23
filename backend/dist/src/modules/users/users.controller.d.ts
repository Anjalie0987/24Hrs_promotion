import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            description: string | null;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            trustScore: number;
            website: string | null;
            isVerified: boolean;
            city: string | null;
            state: string | null;
            isAvailable: boolean;
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
    updateProfile(req: any, data: any): Promise<{
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            description: string | null;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            trustScore: number;
            website: string | null;
            isVerified: boolean;
            city: string | null;
            state: string | null;
            isAvailable: boolean;
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
