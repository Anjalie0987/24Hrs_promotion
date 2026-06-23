import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(businessId: string): Promise<{
        totalPromotions: number;
        activePromotions: number;
        completedPromotions: number;
        completionRate: number;
        totalClicks: number;
        totalQrScans: number;
        totalBannerDownloads: number;
        trustScore: number;
    }>;
    getChartData(businessId: string, days?: number): Promise<any[]>;
    getPromotionsTable(businessId: string, skip?: number, take?: number): Promise<{
        items: {
            id: string;
            partnerName: string;
            partnerLogo: string | null;
            bannerTitle: string;
            bannerUrl: string;
            status: import("@prisma/client").$Enums.PromotionStatus;
            clicks: number;
            scans: number;
            startDate: Date;
            endDate: Date;
        }[];
        total: number;
        skip: number;
        take: number;
    }>;
    getTopPartners(businessId: string): Promise<any[]>;
    getTopBanners(businessId: string): Promise<{
        id: string;
        imageUrl: string;
        title: string | null;
        promotionCount: number;
        clicks: number;
        scans: number;
        downloads: number;
    }[]>;
    getCsvExport(businessId: string): Promise<string>;
    getActivityTimeline(businessId: string): Promise<any[]>;
}
