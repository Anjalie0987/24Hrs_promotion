import { PromotionsService } from './promotions.service';
import { BusinessService } from '../business/business.service';
export declare class PromotionsController {
    private readonly promotionsService;
    private readonly businessService;
    constructor(promotionsService: PromotionsService, businessService: BusinessService);
    findActive(req: any, skip?: string, take?: string): Promise<({
        request: {
            banner: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                originalImageUrl: string;
                watermarkedImageUrl: string | null;
                title: string | null;
                businessId: string;
            };
            senderBusiness: {
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
            };
            receiverBusiness: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.RequestStatus;
            senderBusinessId: string;
            receiverBusinessId: string;
            bannerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PromotionStatus;
        requestId: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
    })[]>;
    findCompleted(req: any, skip?: string, take?: string): Promise<({
        request: {
            banner: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                originalImageUrl: string;
                watermarkedImageUrl: string | null;
                title: string | null;
                businessId: string;
            };
            senderBusiness: {
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
            };
            receiverBusiness: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.RequestStatus;
            senderBusinessId: string;
            receiverBusinessId: string;
            bannerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PromotionStatus;
        requestId: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
    })[]>;
    uploadProof(req: any, dto: {
        promotionId: string;
        proofImageUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PromotionStatus;
        requestId: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
    }>;
}
