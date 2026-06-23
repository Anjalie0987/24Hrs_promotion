import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PromotionsService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    handleCron(): Promise<void>;
    create(requestId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PromotionStatus;
        requestId: string;
        startTime: Date;
        endTime: Date;
        senderProof: string | null;
        receiverProof: string | null;
    }>;
    findActive(businessId: string, skip?: number, take?: number): Promise<({
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
    findCompleted(businessId: string, skip?: number, take?: number): Promise<({
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
    uploadProof(promotionId: string, businessId: string, proofImageUrl: string): Promise<{
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
