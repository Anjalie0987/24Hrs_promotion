import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
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
    updateProfile(req: any, data: any): Promise<{
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
