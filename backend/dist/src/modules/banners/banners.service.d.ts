import { PrismaService } from '../prisma/prisma.service';
export declare class BannersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(businessId: string, data: {
        imageUrl: string;
        title?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        title: string | null;
        businessId: string;
    }>;
    findAllByBusiness(businessId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        title: string | null;
        businessId: string;
    }[]>;
    remove(id: string, businessId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        title: string | null;
        businessId: string;
    }>;
}
