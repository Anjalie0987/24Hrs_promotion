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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const analytics_service_1 = require("../analytics/analytics.service");
const business_service_1 = require("../business/business.service");
const banners_service_1 = require("../banners/banners.service");
const requests_service_1 = require("../requests/requests.service");
const promotions_service_1 = require("../promotions/promotions.service");
let DashboardService = class DashboardService {
    prisma;
    analyticsService;
    businessService;
    bannersService;
    requestsService;
    promotionsService;
    constructor(prisma, analyticsService, businessService, bannersService, requestsService, promotionsService) {
        this.prisma = prisma;
        this.analyticsService = analyticsService;
        this.businessService = businessService;
        this.bannersService = bannersService;
        this.requestsService = requestsService;
        this.promotionsService = promotionsService;
    }
    async getSummary(userId) {
        let business = null;
        try {
            business = await this.businessService.findMe(userId);
        }
        catch (e) {
            return { business: null };
        }
        if (!business) {
            return { business: null };
        }
        const businessId = business.id;
        const [banners, requests, activePromotions, overview, chart, topPartners, topBanners,] = await Promise.all([
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        analytics_service_1.AnalyticsService,
        business_service_1.BusinessService,
        banners_service_1.BannersService,
        requests_service_1.RequestsService,
        promotions_service_1.PromotionsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map