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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BusinessService = class BusinessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existing = await this.prisma.business.findFirst({
            where: { userId },
        });
        if (existing) {
            throw new common_1.ConflictException('Business already exists for this user');
        }
        return this.prisma.business.create({
            data: {
                ...dto,
                userId,
            },
        });
    }
    async findMe(userId) {
        const business = await this.prisma.business.findFirst({
            where: { userId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async findOne(id) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async update(userId, dto) {
        const business = await this.prisma.business.findFirst({
            where: { userId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return this.prisma.business.update({
            where: { id: business.id },
            data: dto,
        });
    }
    async findAll(excludeUserId, filters = {}) {
        const { search, category, location } = filters;
        return this.prisma.business.findMany({
            where: {
                userId: { not: excludeUserId },
                ...(search && {
                    name: { contains: search, mode: 'insensitive' },
                }),
                ...(category && category !== 'All' && {
                    category: { equals: category },
                }),
                ...(location && {
                    location: { contains: location, mode: 'insensitive' },
                }),
            },
            include: {
                banners: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async incrementTrustScore(id, amount) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business)
            return;
        const newScore = Math.min(100, (business.trustScore || 50) + amount);
        return this.prisma.business.update({
            where: { id },
            data: { trustScore: newScore },
        });
    }
    async getRecommended(userId) {
        const myBusiness = await this.prisma.business.findFirst({
            where: { userId },
        });
        if (!myBusiness)
            return [];
        const allBusinesses = await this.prisma.business.findMany({
            where: {
                userId: { not: userId },
            },
            include: {
                banners: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        const complementaryMap = {
            'Restaurant': ['Gym', 'Fitness', 'Cafe', 'Entertainment'],
            'Gym': ['Restaurant', 'Health', 'Retail'],
            'Fashion': ['Salon', 'Makeup', 'Jewelry', 'Photography'],
            'Salon': ['Fashion', 'Makeup', 'Wedding'],
            'Education': ['Coaching', 'Books', 'Technology'],
            'Technology': ['Education', 'Electronics', 'Services'],
        };
        const scoredBusinesses = allBusinesses.map(biz => {
            let score = 0;
            if (biz.category === myBusiness.category) {
                score += 50;
            }
            if (myBusiness.location && biz.location &&
                (biz.location.toLowerCase().includes(myBusiness.location.toLowerCase()) ||
                    myBusiness.location.toLowerCase().includes(biz.location.toLowerCase()))) {
                score += 30;
            }
            const myComplementary = complementaryMap[myBusiness.category] || [];
            if (myComplementary.includes(biz.category)) {
                score += 20;
            }
            return {
                ...biz,
                matchScore: score,
            };
        });
        return scoredBusinesses
            .filter(b => b.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=business.service.js.map