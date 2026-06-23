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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const promotions_service_1 = require("../promotions/promotions.service");
const notifications_service_1 = require("../notifications/notifications.service");
let RequestsService = class RequestsService {
    prisma;
    promotionsService;
    notificationsService;
    constructor(prisma, promotionsService, notificationsService) {
        this.prisma = prisma;
        this.promotionsService = promotionsService;
        this.notificationsService = notificationsService;
    }
    async send(senderBusinessId, data) {
        if (senderBusinessId === data.receiverBusinessId) {
            throw new common_1.BadRequestException('You cannot send a request to yourself');
        }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentRequests = await this.prisma.promotionRequest.count({
            where: {
                senderBusinessId,
                createdAt: { gte: oneHourAgo },
            },
        });
        if (recentRequests >= 10) {
            throw new common_1.BadRequestException('You have reached the limit of 10 requests per hour. Please try again later.');
        }
        const receiver = await this.prisma.business.findUnique({
            where: { id: data.receiverBusinessId },
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Receiver business not found');
        }
        let bannerId = data.bannerId;
        if (!bannerId) {
            const defaultBanner = await this.prisma.banner.findFirst({
                where: { businessId: senderBusinessId },
                orderBy: { createdAt: 'desc' },
            });
            if (!defaultBanner) {
                throw new common_1.BadRequestException('You must create a promotional banner first before sending requests.');
            }
            bannerId = defaultBanner.id;
        }
        const banner = await this.prisma.banner.findUnique({
            where: { id: bannerId },
        });
        if (!banner || banner.businessId !== senderBusinessId) {
            throw new common_1.ForbiddenException('You do not own this banner');
        }
        const existing = await this.prisma.promotionRequest.findFirst({
            where: {
                senderBusinessId,
                receiverBusinessId: data.receiverBusinessId,
                bannerId: bannerId,
                status: 'PENDING',
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('A pending request already exists for this banner');
        }
        const newRequest = await this.prisma.promotionRequest.create({
            data: {
                senderBusinessId,
                receiverBusinessId: data.receiverBusinessId,
                bannerId: bannerId,
                status: 'PENDING',
            },
            include: {
                senderBusiness: true,
                receiverBusiness: true,
                banner: true,
            },
        });
        await this.notificationsService.createNotification(newRequest.receiverBusiness.userId, 'New Promotion Request', `You received a new promotion request from ${newRequest.senderBusiness.name}`, 'promotion_request');
        return newRequest;
    }
    async accept(id, businessId) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (request.receiverBusinessId !== businessId) {
            throw new common_1.ForbiddenException('Only the receiver can accept this request');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Request is already ${request.status.toLowerCase()}`);
        }
        const updatedRequest = await this.prisma.promotionRequest.update({
            where: { id },
            data: { status: 'APPROVED' },
            include: {
                senderBusiness: true,
                receiverBusiness: true,
            },
        });
        await this.promotionsService.create(id);
        await this.notificationsService.createNotification(updatedRequest.senderBusiness.userId, 'Request Approved', `Your promotion request to ${updatedRequest.receiverBusiness.name} was approved!`, 'promotion_approved');
        return updatedRequest;
    }
    async reject(id, businessId) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (request.receiverBusinessId !== businessId) {
            throw new common_1.ForbiddenException('Only the receiver can reject this request');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Request is already ${request.status.toLowerCase()}`);
        }
        const updatedRequest = await this.prisma.promotionRequest.update({
            where: { id },
            data: { status: 'REJECTED' },
            include: { senderBusiness: true },
        });
        await this.notificationsService.createNotification(updatedRequest.senderBusiness.userId, 'Request Rejected', `Your promotion request was rejected.`, 'promotion_rejected');
        return updatedRequest;
    }
    async cancel(id, businessId) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id },
            include: { receiverBusiness: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.senderBusinessId !== businessId) {
            throw new common_1.ForbiddenException('Only the sender can cancel this request');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Cannot cancel a request that is ${request.status}`);
        }
        const updatedRequest = await this.prisma.promotionRequest.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
        await this.notificationsService.createNotification(request.receiverBusiness.userId, 'Request Cancelled', `A promotion request from ${request.senderBusinessId} was cancelled.`, 'request_cancelled');
        return updatedRequest;
    }
    async findIncoming(businessId, skip = 0, take = 20) {
        return this.prisma.promotionRequest.findMany({
            where: { receiverBusinessId: businessId },
            include: {
                senderBusiness: true,
                banner: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
    }
    async findSent(businessId, skip = 0, take = 20) {
        return this.prisma.promotionRequest.findMany({
            where: { senderBusinessId: businessId },
            include: {
                receiverBusiness: true,
                banner: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promotions_service_1.PromotionsService,
        notifications_service_1.NotificationsService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map