import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(requestId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
        requestId: string;
    }>;
    findActive(businessId: string): Promise<({
        request: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
        requestId: string;
    })[]>;
    findAll(businessId: string): Promise<({
        request: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
        requestId: string;
    })[]>;
    uploadProof(promotionId: string, businessId: string, proofImageUrl: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
        requestId: string;
    }>;
}
