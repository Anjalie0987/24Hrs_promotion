import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(req: any, dto: CreateBusinessDto): Promise<{
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
    }>;
    findMe(req: any): Promise<{
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
    }>;
    update(req: any, dto: UpdateBusinessDto): Promise<{
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
    }>;
    getRecommended(req: any): Promise<{
        matchScore: number;
        banners: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        }[];
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
    }[]>;
    findAllAlias(req: any, query: {
        search?: string;
        category?: string;
        location?: string;
    }): Promise<({
        banners: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        }[];
    } & {
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
    })[]>;
    findAll(req: any, query: {
        search?: string;
        category?: string;
        location?: string;
    }): Promise<({
        banners: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            title: string | null;
            businessId: string;
        }[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
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
    }>;
}
