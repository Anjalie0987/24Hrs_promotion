import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessService } from '../business/business.service';
import { BannersService } from '../banners/banners.service';
import { RequestsService } from '../requests/requests.service';
import { PromotionsService } from '../promotions/promotions.service';
export declare class DashboardService {
    private prisma;
    private analyticsService;
    private businessService;
    private bannersService;
    private requestsService;
    private promotionsService;
    constructor(prisma: PrismaService, analyticsService: AnalyticsService, businessService: BusinessService, bannersService: BannersService, requestsService: RequestsService, promotionsService: PromotionsService);
    getSummary(userId: string): Promise<{
        business: null;
        banners?: undefined;
        requests?: undefined;
        activePromotions?: undefined;
        overview?: undefined;
        chart?: undefined;
        topPartners?: undefined;
        topBanners?: undefined;
    } | {
        business: any;
        banners: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            originalImageUrl: string;
            watermarkedImageUrl: string | null;
            title: string | null;
            businessId: string;
        }[];
        requests: ({
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
        })[];
        activePromotions: ({
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
        })[];
        overview: {
            totalPromotions: number;
            activePromotions: number;
            completedPromotions: number;
            completionRate: number;
            totalClicks: number;
            totalQrScans: number;
            totalBannerDownloads: number;
            trustScore: number;
        };
        chart: any[];
        topPartners: any[];
        topBanners: {
            id: string;
            imageUrl: string;
            title: string | null;
            promotionCount: number;
            clicks: number;
            scans: number;
            downloads: number;
        }[];
    }>;
}
