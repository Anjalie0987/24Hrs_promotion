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
        receiverBusiness: {
            id: string;
            createdAt: Date;
            name: string;
            category: string;
            description: string | null;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            trustScore: number;
            userId: string;
            updatedAt: Date;
        };
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    accept(id: string, businessId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    reject(id: string, businessId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    findIncoming(businessId: string): Promise<({
        senderBusiness: {
            id: string;
            createdAt: Date;
            name: string;
            category: string;
            description: string | null;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            trustScore: number;
            userId: string;
            updatedAt: Date;
        };
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    })[]>;
    findSent(businessId: string): Promise<({
        receiverBusiness: {
            id: string;
            createdAt: Date;
            name: string;
            category: string;
            description: string | null;
            location: string | null;
            instagram: string | null;
            whatsapp: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            trustScore: number;
            userId: string;
            updatedAt: Date;
        };
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    })[]>;
}
