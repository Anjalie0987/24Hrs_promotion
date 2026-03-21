import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(requestId: string): Promise<{
        id: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
        createdAt: Date;
        requestId: string;
    }>;
    findActive(businessId: string): Promise<({
        request: {
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
        };
    } & {
        id: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
        createdAt: Date;
        requestId: string;
    })[]>;
    findAll(businessId: string): Promise<({
        request: {
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
        };
    } & {
        id: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
        createdAt: Date;
        requestId: string;
    })[]>;
    uploadProof(promotionId: string, businessId: string, proofImageUrl: string): Promise<{
        id: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
        createdAt: Date;
        requestId: string;
    }>;
}
