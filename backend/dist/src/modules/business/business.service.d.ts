import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
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
    findMe(userId: string): Promise<{
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
    update(userId: string, dto: UpdateBusinessDto): Promise<{
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
    findAll(excludeUserId: string, filters?: {
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
    incrementTrustScore(id: string, amount: number): Promise<{
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
    } | undefined>;
    getRecommended(userId: string): Promise<{
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
}
