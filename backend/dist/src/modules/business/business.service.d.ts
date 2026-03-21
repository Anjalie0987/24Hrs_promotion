import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
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
    }>;
    findMe(userId: string): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(userId: string, dto: UpdateBusinessDto): Promise<{
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
    })[]>;
    incrementTrustScore(id: string, amount: number): Promise<{
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
    }[]>;
}
