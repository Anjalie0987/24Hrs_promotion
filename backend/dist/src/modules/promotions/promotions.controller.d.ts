import { PromotionsService } from './promotions.service';
import { BusinessService } from '../business/business.service';
export declare class PromotionsController {
    private readonly promotionsService;
    private readonly businessService;
    constructor(promotionsService: PromotionsService, businessService: BusinessService);
    findActive(req: any): Promise<({
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
    findAll(req: any): Promise<({
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
    uploadProof(req: any, dto: {
        promotionId: string;
        proofImageUrl: string;
    }): Promise<{
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
