import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        businesses: ({
            promotions: ({
                banners: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    imageUrl: string;
                    promotionId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                title: string;
                startDate: Date;
                endDate: Date;
                businessId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logo: string | null;
            ownerId: string;
            trustScore: number;
        })[];
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(id: string, data: any): Promise<{
        businesses: ({
            promotions: ({
                banners: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    imageUrl: string;
                    promotionId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                title: string;
                startDate: Date;
                endDate: Date;
                businessId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logo: string | null;
            ownerId: string;
            trustScore: number;
        })[];
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
