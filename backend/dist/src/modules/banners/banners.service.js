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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let BannersService = class BannersService {
    prisma;
    cloudinary;
    constructor(prisma, cloudinary) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    async create(businessId, file, data) {
        const uploadResult = await this.cloudinary.uploadImage(file);
        const originalImageUrl = uploadResult.secure_url;
        const watermarkedImageUrl = this.cloudinary.getWatermarkedUrl(uploadResult.public_id);
        return this.prisma.banner.create({
            data: {
                title: data.title,
                originalImageUrl,
                watermarkedImageUrl,
                businessId,
            },
        });
    }
    async findAllByBusiness(businessId) {
        return this.prisma.banner.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id, businessId) {
        const banner = await this.prisma.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new common_1.NotFoundException('Banner not found');
        }
        if (banner.businessId !== businessId) {
            throw new common_1.ForbiddenException('You do not own this banner');
        }
        return this.prisma.banner.delete({
            where: { id },
        });
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], BannersService);
//# sourceMappingURL=banners.service.js.map