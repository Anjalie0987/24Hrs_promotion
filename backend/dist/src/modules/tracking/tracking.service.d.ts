import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class TrackingService {
    private readonly prisma;
    private readonly notificationsGateway;
    private readonly logger;
    private readonly frontendUrl;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    trackClick(promotionId: string, reqInfo: {
        userAgent?: string;
        ipAddress?: string | null;
    }): Promise<string>;
    trackQrScan(promotionId: string, reqInfo: {
        userAgent?: string;
        ipAddress?: string | null;
    }): Promise<string>;
    trackBannerDownload(promotionId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        bannerId: string;
        promotionId: string | null;
        downloaderId: string;
    }>;
    private formatUrl;
    private getDeviceFromUA;
    private getBrowserFromUA;
}
