"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(businessId) {
        const promotions = await this.prisma.promotion.findMany({
            where: { request: { senderBusinessId: businessId } },
            include: {
                _count: {
                    select: { clicks: true, qrScans: true },
                },
            },
        });
        const totalPromotions = promotions.length;
        const activePromotions = promotions.filter((p) => p.status === 'ACTIVE').length;
        const completedPromotions = promotions.filter((p) => p.status === 'COMPLETED').length;
        const completionRate = totalPromotions > 0
            ? Math.round((completedPromotions / totalPromotions) * 100)
            : 0;
        const totalClicks = promotions.reduce((sum, p) => sum + p._count.clicks, 0);
        const totalScans = promotions.reduce((sum, p) => sum + p._count.qrScans, 0);
        const totalDownloads = await this.prisma.bannerDownload.count({
            where: { banner: { businessId: businessId } },
        });
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { trustScore: true },
        });
        return {
            totalPromotions,
            activePromotions,
            completedPromotions,
            completionRate,
            totalClicks,
            totalQrScans: totalScans,
            totalBannerDownloads: totalDownloads,
            trustScore: business?.trustScore || 50,
        };
    }
    async getChartData(businessId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const clicks = await this.prisma.clickTracking.findMany({
            where: {
                createdAt: { gte: startDate },
                promotion: { request: { senderBusinessId: businessId } },
            },
            select: { createdAt: true },
        });
        const scans = await this.prisma.qRScanTracking.findMany({
            where: {
                createdAt: { gte: startDate },
                promotion: { request: { senderBusinessId: businessId } },
            },
            select: { createdAt: true },
        });
        const groupedData = {};
        for (let i = 0; i <= days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            groupedData[dateStr] = { date: dateStr, clicks: 0, scans: 0 };
        }
        clicks.forEach((c) => {
            const dateStr = c.createdAt.toISOString().split('T')[0];
            if (groupedData[dateStr])
                groupedData[dateStr].clicks++;
        });
        scans.forEach((s) => {
            const dateStr = s.createdAt.toISOString().split('T')[0];
            if (groupedData[dateStr])
                groupedData[dateStr].scans++;
        });
        return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
    }
    async getPromotionsTable(businessId, skip = 0, take = 10) {
        const promotions = await this.prisma.promotion.findMany({
            where: { request: { senderBusinessId: businessId } },
            include: {
                request: {
                    include: {
                        receiverBusiness: true,
                        banner: true,
                    },
                },
                _count: {
                    select: { clicks: true, qrScans: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
        const total = await this.prisma.promotion.count({
            where: { request: { senderBusinessId: businessId } },
        });
        return {
            items: promotions.map((p) => ({
                id: p.id,
                partnerName: p.request.receiverBusiness.name,
                partnerLogo: p.request.receiverBusiness.logoUrl,
                bannerTitle: p.request.banner.title || 'Untitled Banner',
                bannerUrl: p.request.banner.watermarkedImageUrl ||
                    p.request.banner.originalImageUrl,
                status: p.status,
                clicks: p._count.clicks,
                scans: p._count.qrScans,
                startDate: p.startTime,
                endDate: p.endTime,
            })),
            total,
            skip,
            take,
        };
    }
    async getTopPartners(businessId) {
        const promotions = await this.prisma.promotion.findMany({
            where: { request: { senderBusinessId: businessId } },
            include: {
                request: { include: { receiverBusiness: true } },
                _count: { select: { clicks: true, qrScans: true } },
            },
        });
        const partnerStats = {};
        promotions.forEach((p) => {
            const partnerId = p.request.receiverBusiness.id;
            if (!partnerStats[partnerId]) {
                partnerStats[partnerId] = {
                    id: partnerId,
                    name: p.request.receiverBusiness.name,
                    logoUrl: p.request.receiverBusiness.logoUrl,
                    totalPromotions: 0,
                    completedPromotions: 0,
                    totalClicks: 0,
                };
            }
            partnerStats[partnerId].totalPromotions++;
            if (p.status === 'COMPLETED')
                partnerStats[partnerId].completedPromotions++;
            partnerStats[partnerId].totalClicks += p._count.clicks;
        });
        const results = Object.values(partnerStats).map((stat) => ({
            ...stat,
            completionRate: stat.totalPromotions > 0
                ? Math.round((stat.completedPromotions / stat.totalPromotions) * 100)
                : 0,
        }));
        return results
            .sort((a, b) => b.totalClicks - a.totalClicks ||
            b.completedPromotions - a.completedPromotions)
            .slice(0, 5);
    }
    async getTopBanners(businessId) {
        const banners = await this.prisma.banner.findMany({
            where: { businessId },
            include: {
                promotionRequests: {
                    include: {
                        promotion: {
                            include: { _count: { select: { clicks: true, qrScans: true } } },
                        },
                    },
                },
                downloads: true,
            },
        });
        const results = banners.map((b) => {
            const activePromotions = b.promotionRequests.filter((pr) => pr.promotion != null);
            let clicks = 0;
            let scans = 0;
            activePromotions.forEach((pr) => {
                clicks += pr.promotion._count.clicks;
                scans += pr.promotion._count.qrScans;
            });
            return {
                id: b.id,
                imageUrl: b.watermarkedImageUrl || b.originalImageUrl,
                title: b.title,
                promotionCount: activePromotions.length,
                clicks,
                scans,
                downloads: b.downloads.length,
            };
        });
        return results.sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    }
    async getCsvExport(businessId) {
        const tableData = await this.getPromotionsTable(businessId, 0, 1000);
        const headers = [
            'Promotion ID',
            'Partner Name',
            'Banner Title',
            'Status',
            'Start Date',
            'End Date',
            'Total Clicks',
            'Total QR Scans',
        ];
        const rows = tableData.items.map((item) => [
            item.id,
            `"${item.partnerName}"`,
            `"${item.bannerTitle}"`,
            item.status,
            new Date(item.startDate).toISOString(),
            new Date(item.endDate).toISOString(),
            item.clicks,
            item.scans,
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');
        return csvContent;
    }
    async getActivityTimeline(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            include: { user: true },
        });
        if (!business)
            return [];
        const events = [];
        events.push({
            id: `profile-${business.id}`,
            type: 'PROFILE_CREATED',
            title: 'Profile Created',
            description: `Welcome to 24HR Status Promotion, ${business.name}!`,
            date: business.createdAt,
        });
        const banners = await this.prisma.banner.findMany({
            where: { businessId },
        });
        banners.forEach((b) => {
            events.push({
                id: `banner-${b.id}`,
                type: 'BANNER_UPLOADED',
                title: 'Banner Uploaded',
                description: `You uploaded a new promotion banner.`,
                date: b.createdAt,
            });
        });
        const sentRequests = await this.prisma.promotionRequest.findMany({
            where: { senderBusinessId: businessId },
            include: { receiverBusiness: true },
        });
        sentRequests.forEach((req) => {
            events.push({
                id: `req-sent-${req.id}`,
                type: 'REQUEST_SENT',
                title: 'Promotion Request Sent',
                description: `You sent a promotion request to ${req.receiverBusiness.name}.`,
                date: req.createdAt,
            });
        });
        const promotions = await this.prisma.promotion.findMany({
            where: { request: { senderBusinessId: businessId } },
            include: { request: { include: { receiverBusiness: true } } },
        });
        promotions.forEach((p) => {
            events.push({
                id: `promo-start-${p.id}`,
                type: 'PROMOTION_STARTED',
                title: 'Promotion Started',
                description: `Your promotion with ${p.request.receiverBusiness.name} went live.`,
                date: p.startTime,
            });
            if (p.status === 'COMPLETED' || p.endTime < new Date()) {
                events.push({
                    id: `promo-end-${p.id}`,
                    type: 'PROMOTION_COMPLETED',
                    title: 'Promotion Completed',
                    description: `Your promotion with ${p.request.receiverBusiness.name} has ended.`,
                    date: p.endTime,
                });
            }
        });
        return events.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map