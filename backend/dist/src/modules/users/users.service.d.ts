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
                imageUrl: string;
                title: string | null;
                businessId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            description: string | null;
            trustScore: number;
            userId: string;
        }) | null;
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(id: string, data: any): Promise<{
        business: ({
            banners: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string;
                title: string | null;
                businessId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            description: string | null;
            trustScore: number;
            userId: string;
        }) | null;
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
