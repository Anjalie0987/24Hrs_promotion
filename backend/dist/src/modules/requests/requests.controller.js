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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const business_service_1 = require("../business/business.service");
let RequestsController = class RequestsController {
    requestsService;
    businessService;
    constructor(requestsService, businessService) {
        this.requestsService = requestsService;
        this.businessService = businessService;
    }
    async send(req, data) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.requestsService.send(business.id, data);
    }
    async accept(req, id) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.requestsService.accept(id, business.id);
    }
    async reject(req, id) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.requestsService.reject(id, business.id);
    }
    async cancel(req, id) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.requestsService.cancel(id, business.id);
    }
    async findIncoming(req, skip, take) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.requestsService.findIncoming(business.id, skip ? parseInt(skip) : 0, take ? parseInt(take) : 20);
    }
    async findSent(req, skip, take) {
        const business = await this.businessService.findMe(req.user.userId);
        return this.requestsService.findSent(business.id, skip ? parseInt(skip) : 0, take ? parseInt(take) : 20);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('accept/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)('reject/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)('cancel/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('incoming'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findIncoming", null);
__decorate([
    (0, common_1.Get)('sent'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findSent", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService,
        business_service_1.BusinessService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map