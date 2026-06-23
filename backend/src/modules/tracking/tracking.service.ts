import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  // Default frontend URL, can be overridden by env
  private readonly frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:3000';

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async trackClick(promotionId: string, reqInfo: any) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        request: {
          include: { senderBusiness: true, banner: true },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Record the click
    await this.prisma.clickTracking.create({
      data: {
        promotionId,
        bannerId: promotion.request.bannerId,
        userAgent: reqInfo.userAgent,
        ipAddress: reqInfo.ipAddress,
        device: this.getDeviceFromUA(reqInfo.userAgent),
        browser: this.getBrowserFromUA(reqInfo.userAgent),
      },
    });

    // Notify real-time analytics
    this.notificationsGateway.server.emit('analytics_update', {
      type: 'new_click',
      promotionId,
      bannerId: promotion.request.bannerId,
      timestamp: new Date(),
    });

    // Determine Redirect URL (Website -> Insta -> Profile)
    const sender = promotion.request.senderBusiness;
    if (sender.website) {
      return this.formatUrl(sender.website);
    }
    if (sender.instagram) {
      return this.formatUrl(sender.instagram);
    }
    return `${this.frontendUrl}/business/${sender.id}`;
  }

  async trackQrScan(promotionId: string, reqInfo: any) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        request: {
          include: { senderBusiness: true, banner: true },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Record the scan
    await this.prisma.qRScanTracking.create({
      data: {
        promotionId,
        bannerId: promotion.request.bannerId,
        userAgent: reqInfo.userAgent,
        ipAddress: reqInfo.ipAddress,
        device: this.getDeviceFromUA(reqInfo.userAgent),
        browser: this.getBrowserFromUA(reqInfo.userAgent),
      },
    });

    // Notify real-time analytics
    this.notificationsGateway.server.emit('analytics_update', {
      type: 'new_qr_scan',
      promotionId,
      bannerId: promotion.request.bannerId,
      timestamp: new Date(),
    });

    const sender = promotion.request.senderBusiness;
    if (sender.website) {
      return this.formatUrl(sender.website);
    }
    if (sender.instagram) {
      return this.formatUrl(sender.instagram);
    }
    return `${this.frontendUrl}/business/${sender.id}`;
  }

  async trackBannerDownload(promotionId: string, userId: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: { request: true },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const business = await this.prisma.business.findUnique({
      where: { userId },
    });

    if (!business) {
      throw new NotFoundException('Business not found for user');
    }

    const download = await this.prisma.bannerDownload.create({
      data: {
        promotionId,
        bannerId: promotion.request.bannerId,
        downloaderId: business.id,
      },
    });

    // Notify real-time analytics
    this.notificationsGateway.server.emit('analytics_update', {
      type: 'new_banner_download',
      promotionId,
      bannerId: promotion.request.bannerId,
      downloaderId: business.id,
      timestamp: new Date(),
    });

    return download;
  }

  private formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  private getDeviceFromUA(ua: string | undefined): string {
    if (!ua) return 'Unknown';
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
  }

  private getBrowserFromUA(ua: string | undefined): string {
    if (!ua) return 'Unknown';
    if (/chrome|crios/i.test(ua)) return 'Chrome';
    if (/firefox|fxios/i.test(ua)) return 'Firefox';
    if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return 'Safari';
    if (/edg/i.test(ua)) return 'Edge';
    return 'Other';
  }
}
