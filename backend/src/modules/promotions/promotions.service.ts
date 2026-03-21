import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(requestId: string) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Promotion request not found');
    }

    if (request.status !== 'ACCEPTED') {
      throw new BadRequestException('Request must be accepted first');
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

  async findActive(businessId: string) {
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
    });
  }

  async findAll(businessId: string) {
    return this.prisma.promotion.findMany({
      where: {
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
    });
  }

  async uploadProof(promotionId: string, businessId: string, proofImageUrl: string) {
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

    const updateData: any = {};
    if (isSender) updateData.senderProof = proofImageUrl;
    if (isReceiver) updateData.receiverProof = proofImageUrl;

    const updatedPromotion = await this.prisma.promotion.update({
      where: { id: promotionId },
      data: updateData,
    });

    // If both proofs are now present, set to COMPLETED
    if (updatedPromotion.senderProof && updatedPromotion.receiverProof) {
      // Increment trust score for both businesses
      const BusinessService = require('../business/business.service').BusinessService;
      // Note: In NestJS we should ideally use dependency injection, but to avoid circular dep 
      // or complex refactoring now, we can use the prisma instance directly or inject it properly.
      // Since I'm already in PromotionsService, I'll just use prisma to update business trust scores here.
      
      await this.prisma.business.update({
        where: { id: promotion.request.senderBusinessId },
        data: { trustScore: { increment: 5 } }
      });
      
      await this.prisma.business.update({
        where: { id: promotion.request.receiverBusinessId },
        data: { trustScore: { increment: 5 } }
      });

      return this.prisma.promotion.update({
        where: { id: promotionId },
        data: { status: 'COMPLETED' },
      });
    }

    return updatedPromotion;
  }
}
