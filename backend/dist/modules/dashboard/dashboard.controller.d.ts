import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(req: AuthenticatedRequest): Promise<{
        business: null;
        banners?: undefined;
        requests?: undefined;
        activePromotions?: undefined;
        overview?: undefined;
        chart?: undefined;
        topPartners?: undefined;
        topBanners?: undefined;
    } | {
        business: {
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
        chart: import("../analytics/analytics.service").ChartData[];
        topPartners: {
            completionRate: number;
            id: string;
            name: string;
            logoUrl: string | null;
            totalPromotions: number;
            completedPromotions: number;
            totalClicks: number;
        }[];
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
