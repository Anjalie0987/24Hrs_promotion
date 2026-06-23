import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running OTP cleanup job...');
    const now = new Date();

    // Delete expired OTPs
    const expiredResult = await this.prisma.otp.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });

    // Delete used OTPs older than 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const usedResult = await this.prisma.otp.deleteMany({
      where: {
        isUsed: true,
        createdAt: { lt: oneDayAgo },
      },
    });

    this.logger.log(
      `Cleanup complete: ${expiredResult.count} expired OTPs deleted, ${usedResult.count} old used OTPs deleted.`,
    );
  }
}
