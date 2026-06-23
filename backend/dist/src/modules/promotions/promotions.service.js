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
var PromotionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
const notifications_service_1 = require("../notifications/notifications.service");
let PromotionsService = PromotionsService_1 = class PromotionsService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(PromotionsService_1.name);
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async handleCron() {
        this.logger.debug('Running automated expiry job for promotions and requests...');
        const now = new Date();
        const expiredPromos = await this.prisma.promotion.findMany({
            where: {
                status: 'ACTIVE',
                endTime: { lt: now },
            },
            include: {
                request: {
                    include: { senderBusiness: true, receiverBusiness: true },
                },
            },
        });
        for (const promo of expiredPromos) {
            await this.prisma.promotion.update({
                where: { id: promo.id },
                data: { status: 'EXPIRED' },
            });
            const title = 'Promotion Expired';
            const msg = `Your promotion with ${promo.request.receiverBusiness.name} has expired without both proofs.`;
            const msgReceiver = `Your promotion with ${promo.request.senderBusiness.name} has expired without both proofs.`;
            await this.notificationsService.createNotification(promo.request.senderBusiness.userId, title, msg, 'promotion_expired');
            await this.notificationsService.createNotification(promo.request.receiverBusiness.userId, title, msgReceiver, 'promotion_expired');
        }
        if (expiredPromos.length > 0) {
            this.logger.log(`Expired ${expiredPromos.length} promotions and sent notifications.`);
        }
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const expiredRequests = await this.prisma.promotionRequest.updateMany({
            where: {
                status: 'PENDING',
                createdAt: { lt: sevenDaysAgo },
            },
            data: { status: 'EXPIRED' },
        });
        if (expiredRequests.count > 0) {
            this.logger.log(`Expired ${expiredRequests.count} pending requests.`);
        }
    }
    async create(requestId) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Promotion request not found');
        }
        if (request.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Request must be approved first');
        }
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
        return this.prisma.promotion.create({
            data: {
                requestId,
                startTime,
                endTime,
                status: 'ACTIVE',
            },
        });
    }
    async findActive(businessId, skip = 0, take = 20) {
        return this.prisma.promotion.findMany({
            where: {
                status: 'ACTIVE',
                request: {
                    OR: [
                        { senderBusinessId: businessId },
                        { receiverBusinessId: businessId },
                    ],
                },
            },
            include: {
                request: {
                    include: {
                        senderBusiness: true,
                        receiverBusiness: true,
                        banner: true,
                    },
                },
            },
            orderBy: { startTime: 'desc' },
            skip,
            take,
        });
    }
    async findCompleted(businessId, skip = 0, take = 20) {
        return this.prisma.promotion.findMany({
            where: {
                status: 'COMPLETED',
                request: {
                    OR: [
                        { senderBusinessId: businessId },
                        { receiverBusinessId: businessId },
                    ],
                },
            },
            include: {
                request: {
                    include: {
                        senderBusiness: true,
                        receiverBusiness: true,
                        banner: true,
                    },
                },
            },
            orderBy: { startTime: 'desc' },
            skip,
            take,
        });
    }
    async uploadProof(promotionId, businessId, proofImageUrl) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id: promotionId },
            include: { request: true },
        });
        if (!promotion) {
            throw new common_1.NotFoundException('Promotion not found');
        }
        if (promotion.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Promotion is not active');
        }
        const isSender = promotion.request.senderBusinessId === businessId;
        const isReceiver = promotion.request.receiverBusinessId === businessId;
        if (!isSender && !isReceiver) {
            throw new common_1.BadRequestException('You are not part of this promotion');
        }
        const updateData = {};
        if (isSender)
            updateData.senderProof = proofImageUrl;
        if (isReceiver)
            updateData.receiverProof = proofImageUrl;
        const updatedPromotion = await this.prisma.promotion.update({
            where: { id: promotionId },
            data: updateData,
        });
        if (updatedPromotion.senderProof && updatedPromotion.receiverProof) {
            await this.prisma.business.update({
                where: { id: promotion.request.senderBusinessId },
                data: { trustScore: { increment: 5 } },
            });
            await this.prisma.business.update({
                where: { id: promotion.request.receiverBusinessId },
                data: { trustScore: { increment: 5 } },
            });
            const completedPromo = await this.prisma.promotion.update({
                where: { id: promotionId },
                data: { status: 'COMPLETED' },
                include: {
                    request: {
                        include: {
                            senderBusiness: true,
                            receiverBusiness: true,
                        },
                    },
                },
            });
            await this.notificationsService.createNotification(completedPromo.request.senderBusiness.userId, 'Promotion Completed!', `Your promotion with ${completedPromo.request.receiverBusiness.name} was successfully completed.`, 'promotion_completed');
            await this.notificationsService.createNotification(completedPromo.request.receiverBusiness.userId, 'Promotion Completed!', `Your promotion with ${completedPromo.request.senderBusiness.name} was successfully completed.`, 'promotion_completed');
            return completedPromo;
        }
        return updatedPromotion;
    }
};
exports.PromotionsService = PromotionsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionsService.prototype, "handleCron", null);
exports.PromotionsService = PromotionsService = PromotionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map