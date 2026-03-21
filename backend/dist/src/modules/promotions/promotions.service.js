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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PromotionsService = class PromotionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(requestId) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Promotion request not found');
        }
        if (request.status !== 'ACCEPTED') {
            throw new common_1.BadRequestException('Request must be accepted first');
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
    async findActive(businessId) {
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
        });
    }
    async findAll(businessId) {
        return this.prisma.promotion.findMany({
            where: {
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
            const BusinessService = require('../business/business.service').BusinessService;
            await this.prisma.business.update({
                where: { id: promotion.request.senderBusinessId },
                data: { trustScore: { increment: 5 } }
            });
            await this.prisma.business.update({
                where: { id: promotion.request.receiverBusinessId },
                data: { trustScore: { increment: 5 } }
            });
            return this.prisma.promotion.update({
                where: { id: promotionId },
                data: { status: 'COMPLETED' },
            });
        }
        return updatedPromotion;
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map