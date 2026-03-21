import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsCron {
  private readonly logger = new Logger(PromotionsCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Checking for expired promotions...');
    const now = new Date();

    const expired = await this.prisma.promotion.updateMany({
      where: {
        status: 'ACTIVE',
        endTime: { lt: now },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (expired.count > 0) {
      this.logger.log(`Marked ${expired.count} promotions as EXPIRED`);
    }
  }
}
