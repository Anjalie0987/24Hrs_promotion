import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotionsService: PromotionsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async send(
    senderBusinessId: string,
    data: { receiverBusinessId: string; bannerId?: string; message?: string },
  ) {
    if (senderBusinessId === data.receiverBusinessId) {
      throw new BadRequestException('You cannot send a request to yourself');
    }

    // Rate Limiting: max 10 requests per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await this.prisma.promotionRequest.count({
      where: {
        senderBusinessId,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentRequests >= 10) {
      throw new BadRequestException(
        'You have reached the limit of 10 requests per hour. Please try again later.',
      );
    }

    // Check if receiver exists
    const receiver = await this.prisma.business.findUnique({
      where: { id: data.receiverBusinessId },
    });
    if (!receiver) {
      throw new NotFoundException('Receiver business not found');
    }

    let bannerId = data.bannerId;
    if (!bannerId) {
      const defaultBanner = await this.prisma.banner.findFirst({
        where: { businessId: senderBusinessId },
        orderBy: { createdAt: 'desc' },
      });
      if (!defaultBanner) {
        throw new BadRequestException(
          'You must create a promotional banner first before sending requests.',
        );
      }
      bannerId = defaultBanner.id;
    }

    // Check if banner belongs to sender
    const banner = await this.prisma.banner.findUnique({
      where: { id: bannerId },
    });
    if (!banner || banner.businessId !== senderBusinessId) {
      throw new ForbiddenException('You do not own this banner');
    }

    // Prevent duplicates
    const existing = await this.prisma.promotionRequest.findFirst({
      where: {
        senderBusinessId,
        receiverBusinessId: data.receiverBusinessId,
        bannerId: bannerId,
        status: 'PENDING',
      },
    });
    if (existing) {
      throw new BadRequestException(
        'A pending request already exists for this banner',
      );
    }

    const newRequest = await this.prisma.promotionRequest.create({
      data: {
        senderBusinessId,
        receiverBusinessId: data.receiverBusinessId,
        bannerId: bannerId,
        status: 'PENDING',
      },
      include: {
        senderBusiness: true,
        receiverBusiness: true,
        banner: true,
      },
    });

    // Real-time database notification
    await this.notificationsService.createNotification(
      newRequest.receiverBusiness.userId,
      'New Promotion Request',
      `You received a new promotion request from ${newRequest.senderBusiness.name}`,
      'promotion_request',
    );

    return newRequest;
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
      throw new BadRequestException(
        `Request is already ${request.status.toLowerCase()}`,
      );
    }

    const updatedRequest = await this.prisma.promotionRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: {
        senderBusiness: true,
        receiverBusiness: true,
      },
    });

    // Automatically create promotion
    await this.promotionsService.create(id);

    // Real-time database notification to sender
    await this.notificationsService.createNotification(
      updatedRequest.senderBusiness.userId,
      'Request Approved',
      `Your promotion request to ${updatedRequest.receiverBusiness.name} was approved!`,
      'promotion_approved',
    );

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
      throw new BadRequestException(
        `Request is already ${request.status.toLowerCase()}`,
      );
    }

    const updatedRequest = await this.prisma.promotionRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: { senderBusiness: true },
    });

    // Real-time database notification to sender
    await this.notificationsService.createNotification(
      updatedRequest.senderBusiness.userId,
      'Request Rejected',
      `Your promotion request was rejected.`,
      'promotion_rejected',
    );

    return updatedRequest;
  }

  async cancel(id: string, businessId: string) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id },
      include: { receiverBusiness: true },
    });

    if (!request) throw new NotFoundException('Request not found');

    if (request.senderBusinessId !== businessId) {
      throw new ForbiddenException('Only the sender can cancel this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel a request that is ${request.status}`,
      );
    }

    const updatedRequest = await this.prisma.promotionRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Real-time database notification to receiver
    await this.notificationsService.createNotification(
      request.receiverBusiness.userId,
      'Request Cancelled',
      `A promotion request from ${request.senderBusinessId} was cancelled.`,
      'request_cancelled',
    );

    return updatedRequest;
  }

  async findIncoming(businessId: string, skip = 0, take = 20) {
    return this.prisma.promotionRequest.findMany({
      where: { receiverBusinessId: businessId },
      include: {
        senderBusiness: true,
        banner: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findSent(businessId: string, skip = 0, take = 20) {
    return this.prisma.promotionRequest.findMany({
      where: { senderBusinessId: businessId },
      include: {
        receiverBusiness: true,
        banner: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }
}
