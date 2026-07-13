import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadApiResponse } from 'cloudinary';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BannersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    businessId: string,
    file: Express.Multer.File,
    data: { title?: string },
  ) {
    const uploadResult: UploadApiResponse =
      await this.cloudinary.uploadImage(file);
    const originalImageUrl = uploadResult.secure_url;
    const watermarkedImageUrl = this.cloudinary.getWatermarkedUrl(
      uploadResult.public_id,
    );

    return this.prisma.banner.create({
      data: {
        title: data.title,
        originalImageUrl,
        watermarkedImageUrl,
        businessId,
      },
    });
  }

  async findAllByBusiness(businessId: string) {
    const banners = await this.prisma.banner.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    if (banners.length === 0) {
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
      });

      if (business && business.bannerUrl) {
        const newBanner = await this.prisma.banner.create({
          data: {
            originalImageUrl: business.bannerUrl,
            watermarkedImageUrl: business.bannerUrl,
            title: 'Business Generated Banner',
            businessId: business.id,
          },
        });
        return [newBanner];
      }
    }

    return banners;
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
