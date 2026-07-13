import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PromotionsService {
  private readonly logger = new Logger(PromotionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug(
      'Running automated expiry job for promotions and requests...',
    );
    const now = new Date();

    // 1. Expire ACTIVE promotions where endTime < now
    const expiredPromos = await this.prisma.promotion.findMany({
      where: {
        status: 'ACTIVE',
        endTime: { lt: now },
      },
      include: {
        request: {
          include: { senderBusiness: true, receiverBusiness: true },
        },
      },
    });

    for (const promo of expiredPromos) {
      await this.prisma.promotion.update({
        where: { id: promo.id },
        data: { status: 'EXPIRED' },
      });

      const title = 'Promotion Expired';
      const msg = `Your promotion with ${promo.request.receiverBusiness.name} has expired without both proofs.`;
      const msgReceiver = `Your promotion with ${promo.request.senderBusiness.name} has expired without both proofs.`;

      await this.notificationsService.createNotification(
        promo.request.senderBusiness.userId,
        title,
        msg,
        'promotion_expired',
      );
      await this.notificationsService.createNotification(
        promo.request.receiverBusiness.userId,
        title,
        msgReceiver,
        'promotion_expired',
      );
    }

    if (expiredPromos.length > 0) {
      this.logger.log(
        `Expired ${expiredPromos.length} promotions and sent notifications.`,
      );
    }

    // 2. Expire PENDING requests older than 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const expiredRequests = await this.prisma.promotionRequest.updateMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: sevenDaysAgo },
      },
      data: { status: 'EXPIRED' },
    });
    if (expiredRequests.count > 0) {
      this.logger.log(`Expired ${expiredRequests.count} pending requests.`);
    }
  }

  async create(requestId: string) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Promotion request not found');
    }

    if (request.status !== 'APPROVED') {
      throw new BadRequestException('Request must be approved first');
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    return this.prisma.promotion.create({
      data: {
        requestId,
        startTime,
        endTime,
        status: 'ACTIVE',
      },
    });
  }

  async findActive(businessId: string, skip = 0, take = 20) {
    return this.prisma.promotion.findMany({
      where: {
        status: 'ACTIVE',
        request: {
          OR: [
            { senderBusinessId: businessId },
            { receiverBusinessId: businessId },
          ],
        },
      },
      include: {
        request: {
          include: {
            senderBusiness: true,
            receiverBusiness: true,
            banner: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
      skip,
      take,
    });
  }

  async findCompleted(businessId: string, skip = 0, take = 20) {
    return this.prisma.promotion.findMany({
      where: {
        status: 'COMPLETED',
        request: {
          OR: [
            { senderBusinessId: businessId },
            { receiverBusinessId: businessId },
          ],
        },
      },
      include: {
        request: {
          include: {
            senderBusiness: true,
            receiverBusiness: true,
            banner: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
      skip,
      take,
    });
  }

  async uploadProof(
    promotionId: string,
    businessId: string,
    proofImageUrl: string,
  ) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: { request: true },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    if (promotion.status !== 'ACTIVE') {
      throw new BadRequestException('Promotion is not active');
    }

    const isSender = promotion.request.senderBusinessId === businessId;
    const isReceiver = promotion.request.receiverBusinessId === businessId;

    if (!isSender && !isReceiver) {
      throw new BadRequestException('You are not part of this promotion');
    }

    const updateData: Prisma.PromotionUpdateInput = {};
    if (isSender) updateData.senderProof = proofImageUrl;
    if (isReceiver) updateData.receiverProof = proofImageUrl;

    const updatedPromotion = await this.prisma.promotion.update({
      where: { id: promotionId },
      data: updateData,
    });

    // If both proofs are now present, set to COMPLETED
    if (updatedPromotion.senderProof && updatedPromotion.receiverProof) {
      // Increment trust score for both businesses
      await this.prisma.business.update({
        where: { id: promotion.request.senderBusinessId },
        data: { trustScore: { increment: 5 } },
      });

      await this.prisma.business.update({
        where: { id: promotion.request.receiverBusinessId },
        data: { trustScore: { increment: 5 } },
      });

      const completedPromo = await this.prisma.promotion.update({
        where: { id: promotionId },
        data: { status: 'COMPLETED' },
        include: {
          request: {
            include: {
              senderBusiness: true,
              receiverBusiness: true,
            },
          },
        },
      });

      // Real-time database notification to both parties
      await this.notificationsService.createNotification(
        completedPromo.request.senderBusiness.userId,
        'Promotion Completed!',
        `Your promotion with ${completedPromo.request.receiverBusiness.name} was successfully completed.`,
        'promotion_completed',
      );
      await this.notificationsService.createNotification(
        completedPromo.request.receiverBusiness.userId,
        'Promotion Completed!',
        `Your promotion with ${completedPromo.request.senderBusiness.name} was successfully completed.`,
        'promotion_completed',
      );

      return completedPromo;
    }

    return updatedPromotion;
  }
}
