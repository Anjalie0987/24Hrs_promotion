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
    }>;
    accept(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
    }>;
    reject(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        senderBusinessId: string;
        receiverBusinessId: string;
        bannerId: string;
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
    })[]>;
}
