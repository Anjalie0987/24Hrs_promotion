import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        businesses: {
          include: {
            promotions: {
              include: {
                banners: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(id: string, data: any) {
    const { firstName, lastName, businessName, businessDescription, bannerUrl } = data;

    // Update user names
    await this.prisma.user.update({
      where: { id },
      data: { firstName, lastName },
    });

    // Handle business creation or update
    if (businessName) {
      const existingBusiness = await this.prisma.business.findFirst({
        where: { ownerId: id },
      });

      if (existingBusiness) {
        await this.prisma.business.update({
          where: { id: existingBusiness.id },
          data: {
            name: businessName,
            description: businessDescription,
          },
        });

        if (bannerUrl) {
          // Update logo or create a banner logic here
          // For now, let's update the business logo field for simplicity
          await this.prisma.business.update({
            where: { id: existingBusiness.id },
            data: { logo: bannerUrl },
          });
        }
      } else {
        await this.prisma.business.create({
          data: {
            name: businessName,
            description: businessDescription,
            logo: bannerUrl,
            ownerId: id,
          },
        });
      }
    }

    return this.findOne(id);
  }
}
