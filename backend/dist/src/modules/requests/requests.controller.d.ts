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
            imageUrl: string;
            title: string | null;
            businessId: string;
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
    }>;
    accept(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    }>;
    reject(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    }>;
    findIncoming(req: any): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
        status: string;
    })[]>;
    findSent(req: any): Promise<({
        banner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
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
    })[]>;
}
