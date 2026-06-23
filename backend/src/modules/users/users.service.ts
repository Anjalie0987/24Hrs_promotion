import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        business: {
          include: {
            banners: true,
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
    const {
      firstName,
      lastName,
      businessName,
      businessDescription,
      category,
      location,
      instagram,
      whatsapp,
      logo,
      logoUrl,
      bannerUrl,
    } = data;

    // Update user names
    await this.prisma.user.update({
      where: { id },
      data: { firstName, lastName },
    });

    // Handle business creation or update
    if (businessName) {
      const existingBusiness = await this.prisma.business.findFirst({
        where: { userId: id },
      });

      if (existingBusiness) {
        await this.prisma.business.update({
          where: { id: existingBusiness.id },
          data: {
            name: businessName,
            description: businessDescription,
            category: category || existingBusiness.category,
            location: location || existingBusiness.location,
            instagram: instagram || existingBusiness.instagram,
            whatsapp: whatsapp || existingBusiness.whatsapp,
            logoUrl: logo || logoUrl || existingBusiness.logoUrl,
            bannerUrl: bannerUrl || existingBusiness.bannerUrl,
          },
        });
      } else {
        await this.prisma.business.create({
          data: {
            name: businessName,
            description: businessDescription,
            category: category || 'Other',
            location,
            instagram,
            whatsapp,
            logoUrl: logo || logoUrl,
            bannerUrl,
            userId: id,
          },
        });
      }
    }

    return this.findOne(id);
  }
}
