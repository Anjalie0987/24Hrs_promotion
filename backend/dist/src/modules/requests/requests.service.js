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
let RequestsService = class RequestsService {
    prisma;
    promotionsService;
    constructor(prisma, promotionsService) {
        this.prisma = prisma;
        this.promotionsService = promotionsService;
    }
    async send(senderBusinessId, data) {
        if (senderBusinessId === data.receiverBusinessId) {
            throw new common_1.BadRequestException('You cannot send a request to yourself');
        }
        const receiver = await this.prisma.business.findUnique({
            where: { id: data.receiverBusinessId },
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Receiver business not found');
        }
        const banner = await this.prisma.banner.findUnique({
            where: { id: data.bannerId },
        });
        if (!banner || banner.businessId !== senderBusinessId) {
            throw new common_1.ForbiddenException('You do not own this banner');
        }
        const existing = await this.prisma.promotionRequest.findFirst({
            where: {
                senderBusinessId,
                receiverBusinessId: data.receiverBusinessId,
                bannerId: data.bannerId,
                status: 'PENDING',
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('A pending request already exists for this banner');
        }
        return this.prisma.promotionRequest.create({
            data: {
                senderBusinessId,
                receiverBusinessId: data.receiverBusinessId,
                bannerId: data.bannerId,
                status: 'PENDING',
            },
            include: {
                receiverBusiness: true,
                banner: true,
            },
        });
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
            data: { status: 'ACCEPTED' },
        });
        await this.promotionsService.create(id);
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
        return this.prisma.promotionRequest.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }
    async findIncoming(businessId) {
        return this.prisma.promotionRequest.findMany({
            where: { receiverBusinessId: businessId },
            include: {
                senderBusiness: true,
                banner: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findSent(businessId) {
        return this.prisma.promotionRequest.findMany({
            where: { senderBusinessId: businessId },
            include: {
                receiverBusiness: true,
                banner: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promotions_service_1.PromotionsService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map