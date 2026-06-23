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
var CleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let CleanupService = CleanupService_1 = class CleanupService {
    prisma;
    logger = new common_1.Logger(CleanupService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleCron() {
        this.logger.log('Running OTP cleanup job...');
        const now = new Date();
        const expiredResult = await this.prisma.otp.deleteMany({
            where: {
                expiresAt: { lt: now },
            },
        });
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const usedResult = await this.prisma.otp.deleteMany({
            where: {
                isUsed: true,
                createdAt: { lt: oneDayAgo },
            },
        });
        this.logger.log(`Cleanup complete: ${expiredResult.count} expired OTPs deleted, ${usedResult.count} old used OTPs deleted.`);
    }
};
exports.CleanupService = CleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleCron", null);
exports.CleanupService = CleanupService = CleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CleanupService);
//# sourceMappingURL=cleanup.service.js.map