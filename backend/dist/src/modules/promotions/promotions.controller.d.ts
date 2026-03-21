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
                name: string;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                trustScore: number;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
            receiverBusiness: {
                id: string;
                name: string;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                trustScore: number;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            senderBusinessId: string;
            receiverBusinessId: string;
            bannerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        requestId: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
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
                name: string;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                trustScore: number;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
            receiverBusiness: {
                id: string;
                name: string;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                trustScore: number;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            senderBusinessId: string;
            receiverBusinessId: string;
            bannerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        requestId: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
    })[]>;
    uploadProof(req: any, dto: {
        promotionId: string;
        proofImageUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        requestId: string;
        startTime: Date;
        endTime: Date;
        status: string;
        senderProof: string | null;
        receiverProof: string | null;
    }>;
}
