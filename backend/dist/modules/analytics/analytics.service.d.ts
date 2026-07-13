import { PrismaService } from '../prisma/prisma.service';
export interface ChartData {
    date: string;
    clicks: number;
    scans: number;
}
export interface TimelineEvent {
    id: string;
    type: string;
    title: string;
    description: string;
    date: Date;
}
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
    getChartData(businessId: string, days?: number): Promise<ChartData[]>;
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
    getTopPartners(businessId: string): Promise<{
        completionRate: number;
        id: string;
        name: string;
        logoUrl: string | null;
        totalPromotions: number;
        completedPromotions: number;
        totalClicks: number;
    }[]>;
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
    getActivityTimeline(businessId: string): Promise<TimelineEvent[]>;
}
