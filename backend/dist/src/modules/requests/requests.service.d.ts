import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
export declare class RequestsService {
    private readonly prisma;
    private readonly promotionsService;
    constructor(prisma: PrismaService, promotionsService: PromotionsService);
    send(senderBusinessId: string, data: {
        receiverBusinessId: string;
        bannerId: string;
    }): Promise<{
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        };
        receiverBusiness: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    }>;
    accept(id: string, businessId: string): Promise<{
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    }>;
    reject(id: string, businessId: string): Promise<{
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    }>;
    findIncoming(businessId: string): Promise<({
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        };
        senderBusiness: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    })[]>;
    findSent(businessId: string): Promise<({
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        };
        receiverBusiness: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    })[]>;
}
