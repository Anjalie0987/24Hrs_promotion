import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotionsService: PromotionsService,
  ) {}

  async send(senderBusinessId: string, data: { receiverBusinessId: string; bannerId: string }) {
    if (senderBusinessId === data.receiverBusinessId) {
      throw new BadRequestException('You cannot send a request to yourself');
    }

    // Check if receiver exists
    const receiver = await this.prisma.business.findUnique({
      where: { id: data.receiverBusinessId },
    });
    if (!receiver) {
      throw new NotFoundException('Receiver business not found');
    }

    // Check if banner belongs to sender
    const banner = await this.prisma.banner.findUnique({
      where: { id: data.bannerId },
    });
    if (!banner || banner.businessId !== senderBusinessId) {
      throw new ForbiddenException('You do not own this banner');
    }

    // Prevent duplicates
    const existing = await this.prisma.promotionRequest.findFirst({
      where: {
        senderBusinessId,
        receiverBusinessId: data.receiverBusinessId,
        bannerId: data.bannerId,
        status: 'PENDING',
      },
    });
    if (existing) {
      throw new BadRequestException('A pending request already exists for this banner');
    }

    return this.prisma.promotionRequest.create({
      data: {
        senderBusinessId,
        receiverBusinessId: data.receiverBusinessId,
        bannerId: data.bannerId,
        status: 'PENDING',
      },
      include: {
        receiverBusiness: true,
        banner: true,
      },
    });
  }

  async accept(id: string, businessId: string) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.receiverBusinessId !== businessId) {
      throw new ForbiddenException('Only the receiver can accept this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Request is already ${request.status.toLowerCase()}`);
    }

    const updatedRequest = await this.prisma.promotionRequest.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });

    // Automatically create promotion
    await this.promotionsService.create(id);

    return updatedRequest;
  }

  async reject(id: string, businessId: string) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.receiverBusinessId !== businessId) {
      throw new ForbiddenException('Only the receiver can reject this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Request is already ${request.status.toLowerCase()}`);
    }

    return this.prisma.promotionRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async findIncoming(businessId: string) {
    return this.prisma.promotionRequest.findMany({
      where: { receiverBusinessId: businessId },
      include: {
        senderBusiness: true,
        banner: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSent(businessId: string) {
    return this.prisma.promotionRequest.findMany({
      where: { senderBusinessId: businessId },
      include: {
        receiverBusiness: true,
        banner: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
