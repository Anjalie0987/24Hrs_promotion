import { AnalyticsService } from './analytics.service';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly prisma;
    constructor(analyticsService: AnalyticsService, prisma: PrismaService);
    private getBusinessId;
    getOverview(req: any): Promise<{
        totalPromotions: number;
        activePromotions: number;
        completedPromotions: number;
        completionRate: number;
        totalClicks: number;
        totalQrScans: number;
        totalBannerDownloads: number;
        trustScore: number;
    }>;
    getChartData(req: any, days: string): Promise<any[]>;
    getPromotionsTable(req: any, skip?: string, take?: string): Promise<{
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
    getTopPartners(req: any): Promise<any[]>;
    getTopBanners(req: any): Promise<{
        id: string;
        imageUrl: string;
        title: string | null;
        promotionCount: number;
        clicks: number;
        scans: number;
        downloads: number;
    }[]>;
    exportCsv(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getActivityTimeline(req: any): Promise<any[]>;
}
