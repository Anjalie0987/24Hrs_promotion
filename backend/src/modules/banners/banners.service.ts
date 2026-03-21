import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(businessId: string, data: { imageUrl: string; title?: string }) {
    return this.prisma.banner.create({
      data: {
        ...data,
        businessId,
      },
    });
  }

  async findAllByBusiness(businessId: string) {
    return this.prisma.banner.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, businessId: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    if (banner.businessId !== businessId) {
      throw new ForbiddenException('You do not own this banner');
    }

    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
