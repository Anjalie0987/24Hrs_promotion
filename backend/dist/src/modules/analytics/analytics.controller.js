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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
const throttler_1 = require("@nestjs/throttler");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    prisma;
    constructor(analyticsService, prisma) {
        this.analyticsService = analyticsService;
        this.prisma = prisma;
    }
    async getBusinessId(userId) {
        const business = await this.prisma.business.findUnique({
            where: { userId },
        });
        if (!business)
            throw new common_1.NotFoundException('Business not found');
        return business.id;
    }
    async getOverview(req) {
        const businessId = await this.getBusinessId(req.user.userId);
        return this.analyticsService.getOverview(businessId);
    }
    async getChartData(req, days) {
        const businessId = await this.getBusinessId(req.user.userId);
        const numDays = days ? parseInt(days, 10) : 30;
        return this.analyticsService.getChartData(businessId, numDays);
    }
    async getPromotionsTable(req, skip, take) {
        const businessId = await this.getBusinessId(req.user.userId);
        return this.analyticsService.getPromotionsTable(businessId, skip ? parseInt(skip, 10) : 0, take ? parseInt(take, 10) : 10);
    }
    async getTopPartners(req) {
        const businessId = await this.getBusinessId(req.user.userId);
        return this.analyticsService.getTopPartners(businessId);
    }
    async getTopBanners(req) {
        const businessId = await this.getBusinessId(req.user.userId);
        return this.analyticsService.getTopBanners(businessId);
    }
    async exportCsv(req, res) {
        const businessId = await this.getBusinessId(req.user.userId);
        const csvData = await this.analyticsService.getCsvExport(businessId);
        res.header('Content-Type', 'text/csv');
        res.attachment(`analytics_${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csvData);
    }
    async getActivityTimeline(req) {
        const businessId = await this.getBusinessId(req.user.userId);
        return this.analyticsService.getActivityTimeline(businessId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('chart'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getChartData", null);
__decorate([
    (0, common_1.Get)('promotions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPromotionsTable", null);
__decorate([
    (0, common_1.Get)('partners'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopPartners", null);
__decorate([
    (0, common_1.Get)('banners'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopBanners", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('activity'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getActivityTimeline", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 500, ttl: 900000 } }),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        prisma_service_1.PrismaService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map