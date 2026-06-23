import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessService } from '../business/business.service';
import { BannersService } from '../banners/banners.service';
import { RequestsService } from '../requests/requests.service';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService,
    private businessService: BusinessService,
    private bannersService: BannersService,
    private requestsService: RequestsService,
    private promotionsService: PromotionsService,
  ) {}

  async getSummary(userId: string) {
    // 1. Get Business
    let business: any = null;
    try {
      business = await this.businessService.findMe(userId);
    } catch (e) {
      // User might not have a business yet
      return { business: null };
    }

    if (!business) {
      return { business: null };
    }

    const businessId = business.id;

    // Fetch data in parallel
    const [
      banners,
      requests,
      activePromotions,
      overview,
      chart,
      topPartners,
      topBanners,
    ] = await Promise.all([
      this.bannersService.findAllByBusiness(businessId),
      this.requestsService.findIncoming(businessId, 0, 50),
      this.promotionsService.findActive(businessId),
      this.analyticsService.getOverview(businessId),
      this.analyticsService.getChartData(businessId, 30),
      this.analyticsService.getTopPartners(businessId),
      this.analyticsService.getTopBanners(businessId),
    ]);

    return {
      business,
      banners,
      requests,
      activePromotions,
      overview,
      chart,
      topPartners,
      topBanners,
    };
  }
}
