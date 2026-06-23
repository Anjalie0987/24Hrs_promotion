import { RequestsService } from './requests.service';
import { BusinessService } from '../business/business.service';
export declare class RequestsController {
    private readonly requestsService;
    private readonly businessService;
    constructor(requestsService: RequestsService, businessService: BusinessService);
    send(req: any, data: {
        receiverBusinessId: string;
        bannerId: string;
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
    accept(req: any, id: string): Promise<{
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
    reject(req: any, id: string): Promise<{
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
    cancel(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.RequestStatus;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    findIncoming(req: any, skip?: string, take?: string): Promise<({
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
    findSent(req: any, skip?: string, take?: string): Promise<({
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
