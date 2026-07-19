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
                name: string;
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                bannerTemplate: string | null;
                trustScore: number;
                website: string | null;
                isVerified: boolean;
                city: string | null;
                state: string | null;
                isAvailable: boolean;
                ownerName: string | null;
                ownerPhotoUrl: string | null;
                yearsExperience: number | null;
                userId: string;
            };
            receiverBusiness: {
                name: string;
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                bannerTemplate: string | null;
                trustScore: number;
                website: string | null;
                isVerified: boolean;
                city: string | null;
                state: string | null;
                isAvailable: boolean;
                ownerName: string | null;
                ownerPhotoUrl: string | null;
                yearsExperience: number | null;
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
                name: string;
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                bannerTemplate: string | null;
                trustScore: number;
                website: string | null;
                isVerified: boolean;
                city: string | null;
                state: string | null;
                isAvailable: boolean;
                ownerName: string | null;
                ownerPhotoUrl: string | null;
                yearsExperience: number | null;
                userId: string;
            };
            receiverBusiness: {
                name: string;
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                description: string | null;
                location: string | null;
                instagram: string | null;
                whatsapp: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                bannerTemplate: string | null;
                trustScore: number;
                website: string | null;
                isVerified: boolean;
                city: string | null;
                state: string | null;
                isAvailable: boolean;
                ownerName: string | null;
                ownerPhotoUrl: string | null;
                yearsExperience: number | null;
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
