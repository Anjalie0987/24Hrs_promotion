import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Throttle } from '@nestjs/throttler';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 500, ttl: 900000 } })
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService,
  ) {}

  private async getBusinessId(userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { userId },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business.id;
  }

  @Get('overview')
  async getOverview(@Request() req: any) {
    const businessId = await this.getBusinessId(req.user.userId);
    return this.analyticsService.getOverview(businessId);
  }

  @Get('chart')
  async getChartData(@Request() req: any, @Query('days') days: string) {
    const businessId = await this.getBusinessId(req.user.userId);
    const numDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getChartData(businessId, numDays);
  }

  @Get('promotions')
  async getPromotionsTable(
    @Request() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const businessId = await this.getBusinessId(req.user.userId);
    return this.analyticsService.getPromotionsTable(
      businessId,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 10,
    );
  }

  @Get('partners')
  async getTopPartners(@Request() req: any) {
    const businessId = await this.getBusinessId(req.user.userId);
    return this.analyticsService.getTopPartners(businessId);
  }

  @Get('banners')
  async getTopBanners(@Request() req: any) {
    const businessId = await this.getBusinessId(req.user.userId);
    return this.analyticsService.getTopBanners(businessId);
  }

  @Get('export')
  async exportCsv(@Request() req: any, @Res() res: Response) {
    const businessId = await this.getBusinessId(req.user.userId);
    const csvData = await this.analyticsService.getCsvExport(businessId);

    res.header('Content-Type', 'text/csv');
    res.attachment(`analytics_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvData);
  }

  @Get('activity')
  async getActivityTimeline(@Request() req: any) {
    const businessId = await this.getBusinessId(req.user.userId);
    return this.analyticsService.getActivityTimeline(businessId);
  }
}
