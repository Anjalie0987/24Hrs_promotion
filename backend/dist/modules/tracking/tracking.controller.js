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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const tracking_service_1 = require("./tracking.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TrackingController = class TrackingController {
    trackingService;
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async trackClick(promotionId, req, res) {
        const reqInfo = {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.socket.remoteAddress,
        };
        try {
            const redirectUrl = await this.trackingService.trackClick(promotionId, reqInfo);
            return res.redirect(redirectUrl);
        }
        catch {
            const fallbackUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(fallbackUrl);
        }
    }
    async trackQrScan(promotionId, req, res) {
        const reqInfo = {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.socket.remoteAddress,
        };
        try {
            const redirectUrl = await this.trackingService.trackQrScan(promotionId, reqInfo);
            return res.redirect(redirectUrl);
        }
        catch {
            const fallbackUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(fallbackUrl);
        }
    }
    async trackDownload(promotionId, req) {
        const userId = req.user.userId;
        const result = await this.trackingService.trackBannerDownload(promotionId, userId);
        return { success: true, data: result };
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Get)('click/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackClick", null);
__decorate([
    (0, common_1.Get)('qr/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackQrScan", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('download/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackDownload", null);
exports.TrackingController = TrackingController = __decorate([
    (0, common_1.Controller)('tracking'),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map