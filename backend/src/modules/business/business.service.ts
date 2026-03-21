import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBusinessDto) {
    const existing = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Business already exists for this user');
    }

    return this.prisma.business.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findMe(userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async update(userId: string, dto: UpdateBusinessDto) {
    const business = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.business.update({
      where: { id: business.id },
      data: dto,
    });
  }

  async findAll(excludeUserId: string, filters: { search?: string; category?: string; location?: string } = {}) {
    const { search, category, location } = filters;
    
    return this.prisma.business.findMany({
      where: {
        userId: { not: excludeUserId },
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
        ...(category && category !== 'All' && {
          category: { equals: category },
        }),
        ...(location && {
          location: { contains: location, mode: 'insensitive' },
        }),
      },
      include: {
        banners: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async incrementTrustScore(id: string, amount: number) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) return;

    const newScore = Math.min(100, (business.trustScore || 50) + amount);

    return this.prisma.business.update({
      where: { id },
      data: { trustScore: newScore },
    });
  }

  async getRecommended(userId: string) {
    const myBusiness = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (!myBusiness) return [];

    const allBusinesses = await this.prisma.business.findMany({
      where: {
        userId: { not: userId },
      },
      include: {
        banners: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const complementaryMap: Record<string, string[]> = {
      'Restaurant': ['Gym', 'Fitness', 'Cafe', 'Entertainment'],
      'Gym': ['Restaurant', 'Health', 'Retail'],
      'Fashion': ['Salon', 'Makeup', 'Jewelry', 'Photography'],
      'Salon': ['Fashion', 'Makeup', 'Wedding'],
      'Education': ['Coaching', 'Books', 'Technology'],
      'Technology': ['Education', 'Electronics', 'Services'],
    };

    const scoredBusinesses = allBusinesses.map(biz => {
      let score = 0;

      // 1. Same Category (+50)
      if (biz.category === myBusiness.category) {
        score += 50;
      }

      // 2. Same Location (+30) - simple partial match
      if (myBusiness.location && biz.location && 
          (biz.location.toLowerCase().includes(myBusiness.location.toLowerCase()) || 
           myBusiness.location.toLowerCase().includes(biz.location.toLowerCase()))) {
        score += 30;
      }

      // 3. Complementary Category (+20)
      const myComplementary = complementaryMap[myBusiness.category] || [];
      if (myComplementary.includes(biz.category)) {
        score += 20;
      }

      return {
        ...biz,
        matchScore: score,
      };
    });

    // Filter out scores of 0 and sort by score DESC
    return scoredBusinesses
      .filter(b => b.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }
}
