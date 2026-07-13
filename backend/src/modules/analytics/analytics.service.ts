import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(businessId: string) {
    // Analytics are focused on promotions where this business is the SENDER
    // (i.e. their banner is being displayed to someone else's audience).
    const promotions = await this.prisma.promotion.findMany({
      where: { request: { senderBusinessId: businessId } },
      include: {
        _count: {
          select: { clicks: true, qrScans: true },
        },
      },
    });

    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter(
      (p) => p.status === 'ACTIVE',
    ).length;
    const completedPromotions = promotions.filter(
      (p) => p.status === 'COMPLETED',
    ).length;

    // Approved requests = total promotions created ever (completed + active + expired + disputed)
    // We can just use totalPromotions for the denominator since one promotion is created per approved request.
    const completionRate =
      totalPromotions > 0
        ? Math.round((completedPromotions / totalPromotions) * 100)
        : 0;

    const totalClicks = promotions.reduce((sum, p) => sum + p._count.clicks, 0);
    const totalScans = promotions.reduce((sum, p) => sum + p._count.qrScans, 0);

    // Total Banner Downloads for all banners owned by this business
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

  async getChartData(businessId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all clicks and scans in timeframe
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

    // Group by Date (YYYY-MM-DD)
    const groupedData: Record<string, ChartData> = {};

    // Initialize all dates in range with 0
    for (let i = 0; i <= days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      groupedData[dateStr] = { date: dateStr, clicks: 0, scans: 0 };
    }

    clicks.forEach((c) => {
      const dateStr = c.createdAt.toISOString().split('T')[0];
      if (groupedData[dateStr]) groupedData[dateStr].clicks++;
    });

    scans.forEach((s) => {
      const dateStr = s.createdAt.toISOString().split('T')[0];
      if (groupedData[dateStr]) groupedData[dateStr].scans++;
    });

    // Return array sorted chronologically
    return Object.values(groupedData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  async getPromotionsTable(businessId: string, skip = 0, take = 10) {
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
        bannerUrl:
          p.request.banner.watermarkedImageUrl ||
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

  async getTopPartners(businessId: string) {
    const promotions = await this.prisma.promotion.findMany({
      where: { request: { senderBusinessId: businessId } },
      include: {
        request: { include: { receiverBusiness: true } },
        _count: { select: { clicks: true, qrScans: true } },
      },
    });

    interface PartnerStat {
      id: string;
      name: string;
      logoUrl: string | null;
      totalPromotions: number;
      completedPromotions: number;
      totalClicks: number;
    }
    const partnerStats: Record<string, PartnerStat> = {};

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
      completionRate:
        stat.totalPromotions > 0
          ? Math.round((stat.completedPromotions / stat.totalPromotions) * 100)
          : 0,
    }));

    // Sort by most clicks, then most completed
    return results
      .sort(
        (a, b) =>
          b.totalClicks - a.totalClicks ||
          b.completedPromotions - a.completedPromotions,
      )
      .slice(0, 5);
  }

  async getTopBanners(businessId: string) {
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
      const activePromotions = b.promotionRequests.filter(
        (pr) => pr.promotion != null,
      );
      let clicks = 0;
      let scans = 0;

      activePromotions.forEach((pr) => {
        clicks += pr.promotion!._count.clicks;
        scans += pr.promotion!._count.qrScans;
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

  async getCsvExport(businessId: string) {
    const tableData = await this.getPromotionsTable(businessId, 0, 1000); // Max 1000 for export MVP

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

  async getActivityTimeline(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { user: true },
    });

    if (!business) return [];
    const events: TimelineEvent[] = [];

    // 1. Profile Created
    events.push({
      id: `profile-${business.id}`,
      type: 'PROFILE_CREATED',
      title: 'Profile Created',
      description: `Welcome to 24HR Status Promotion, ${business.name}!`,
      date: business.createdAt,
    });

    // 2. Banners Uploaded
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

    // 3. Requests Sent
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

    // 4. Promotions Started/Completed
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

    // Sort descending by date
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
