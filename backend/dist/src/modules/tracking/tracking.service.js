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
var TrackingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let TrackingService = TrackingService_1 = class TrackingService {
    prisma;
    notificationsGateway;
    logger = new common_1.Logger(TrackingService_1.name);
    frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    constructor(prisma, notificationsGateway) {
        this.prisma = prisma;
        this.notificationsGateway = notificationsGateway;
    }
    async trackClick(promotionId, reqInfo) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id: promotionId },
            include: {
                request: {
                    include: { senderBusiness: true, banner: true },
                },
            },
        });
        if (!promotion) {
            throw new common_1.NotFoundException('Promotion not found');
        }
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
        this.notificationsGateway.server.emit('analytics_update', {
            type: 'new_click',
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
    async trackQrScan(promotionId, reqInfo) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id: promotionId },
            include: {
                request: {
                    include: { senderBusiness: true, banner: true },
                },
            },
        });
        if (!promotion) {
            throw new common_1.NotFoundException('Promotion not found');
        }
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
    async trackBannerDownload(promotionId, userId) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id: promotionId },
            include: { request: true },
        });
        if (!promotion) {
            throw new common_1.NotFoundException('Promotion not found');
        }
        const business = await this.prisma.business.findUnique({
            where: { userId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found for user');
        }
        const download = await this.prisma.bannerDownload.create({
            data: {
                promotionId,
                bannerId: promotion.request.bannerId,
                downloaderId: business.id,
            },
        });
        this.notificationsGateway.server.emit('analytics_update', {
            type: 'new_banner_download',
            promotionId,
            bannerId: promotion.request.bannerId,
            downloaderId: business.id,
            timestamp: new Date(),
        });
        return download;
    }
    formatUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }
    getDeviceFromUA(ua) {
        if (!ua)
            return 'Unknown';
        if (/mobile/i.test(ua))
            return 'Mobile';
        if (/tablet/i.test(ua))
            return 'Tablet';
        return 'Desktop';
    }
    getBrowserFromUA(ua) {
        if (!ua)
            return 'Unknown';
        if (/chrome|crios/i.test(ua))
            return 'Chrome';
        if (/firefox|fxios/i.test(ua))
            return 'Firefox';
        if (/safari/i.test(ua) && !/chrome|crios/i.test(ua))
            return 'Safari';
        if (/edg/i.test(ua))
            return 'Edge';
        return 'Other';
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = TrackingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map