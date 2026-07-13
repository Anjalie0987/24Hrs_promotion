"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BannerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const banner_factory_1 = require("./banner.factory");
let BannerService = BannerService_1 = class BannerService {
    logger = new common_1.Logger(BannerService_1.name);
    async generateBusinessBanner(data, template = 'corporate') {
        this.logger.log(`Generating banner for business: ${data.name} using template: ${template}`);
        try {
            const buffer = await (0, banner_factory_1.generateBannerByTemplate)(data, template);
            this.logger.log(`Banner generated successfully for: ${data.name}`);
            return buffer;
        }
        catch (error) {
            this.logger.error(`Failed to generate banner for ${data.name}`, error);
            throw error;
        }
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = BannerService_1 = __decorate([
    (0, common_1.Injectable)()
], BannerService);
//# sourceMappingURL=banner.service.js.map