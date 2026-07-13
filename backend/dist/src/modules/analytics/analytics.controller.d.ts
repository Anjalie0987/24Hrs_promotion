import { AnalyticsService } from './analytics.service';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly prisma;
    constructor(analyticsService: AnalyticsService, prisma: PrismaService);
    private getBusinessId;
    getOverview(req: AuthenticatedRequest): Promise<{
        totalPromotions: number;
        activePromotions: number;
        completedPromotions: number;
        completionRate: number;
        totalClicks: number;
        totalQrScans: number;
        totalBannerDownloads: number;
        trustScore: number;
    }>;
    getChartData(req: AuthenticatedRequest, days: string): Promise<import("./analytics.service").ChartData[]>;
    getPromotionsTable(req: AuthenticatedRequest, skip?: string, take?: string): Promise<{
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
    getTopPartners(req: AuthenticatedRequest): Promise<{
        completionRate: number;
        id: string;
        name: string;
        logoUrl: string | null;
        totalPromotions: number;
        completedPromotions: number;
        totalClicks: number;
    }[]>;
    getTopBanners(req: AuthenticatedRequest): Promise<{
        id: string;
        imageUrl: string;
        title: string | null;
        promotionCount: number;
        clicks: number;
        scans: number;
        downloads: number;
    }[]>;
    exportCsv(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getActivityTimeline(req: AuthenticatedRequest): Promise<import("./analytics.service").TimelineEvent[]>;
}
