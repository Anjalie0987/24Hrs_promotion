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
exports.PromotionsController = void 0;
const common_1 = require("@nestjs/common");
const promotions_service_1 = require("./promotions.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const business_service_1 = require("../business/business.service");
let PromotionsController = class PromotionsController {
    promotionsService;
    businessService;
    constructor(promotionsService, businessService) {
        this.promotionsService = promotionsService;
        this.businessService = businessService;
    }
    async findActive(req, skip, take) {
        const business = await this.businessService.findMe(req.user.id || req.user.userId);
        return this.promotionsService.findActive(business.id, skip ? parseInt(skip) : 0, take ? parseInt(take) : 20);
    }
    async findCompleted(req, skip, take) {
        const business = await this.businessService.findMe(req.user.id || req.user.userId);
        return this.promotionsService.findCompleted(business.id, skip ? parseInt(skip) : 0, take ? parseInt(take) : 20);
    }
    async uploadProof(req, dto) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.promotionsService.uploadProof(dto.promotionId, business.id, dto.proofImageUrl);
    }
};
exports.PromotionsController = PromotionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "findActive", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('completed'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "findCompleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload-proof'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "uploadProof", null);
exports.PromotionsController = PromotionsController = __decorate([
    (0, common_1.Controller)('promotions'),
    __metadata("design:paramtypes", [promotions_service_1.PromotionsService,
        business_service_1.BusinessService])
], PromotionsController);
//# sourceMappingURL=promotions.controller.js.map