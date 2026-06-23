import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class RequestsService {
    private readonly prisma;
    private readonly promotionsService;
    private readonly notificationsService;
    constructor(prisma: PrismaService, promotionsService: PromotionsService, notificationsService: NotificationsService);
    send(senderBusinessId: string, data: {
        receiverBusinessId: string;
        bannerId?: string;
        message?: string;
    }): Promise<{
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
    }>;
    accept(id: string, businessId: string): Promise<{
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
    }>;
    reject(id: string, businessId: string): Promise<{
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
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.RequestStatus;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    cancel(id: string, businessId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.RequestStatus;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    findIncoming(businessId: string, skip?: number, take?: number): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.RequestStatus;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    })[]>;
    findSent(businessId: string, skip?: number, take?: number): Promise<({
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            originalImageUrl: string;
            watermarkedImageUrl: string | null;
            title: string | null;
            businessId: string;
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
    })[]>;
}
