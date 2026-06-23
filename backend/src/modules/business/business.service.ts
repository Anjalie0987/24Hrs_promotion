import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async findAll(excludeUserId: string, filters: any = {}) {
    const {
      search,
      category,
      city,
      state,
      minTrustScore,
      isVerified,
      hasWebsite,
      hasInstagram,
      skip = 0,
      take = 12,
    } = filters;

    const businesses = await this.prisma.business.findMany({
      where: {
        userId: { not: excludeUserId },
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(category &&
          category !== 'All' && {
            category: { equals: category },
          }),
        ...(city && {
          city: { equals: city, mode: 'insensitive' },
        }),
        ...(state && {
          state: { equals: state, mode: 'insensitive' },
        }),
        ...(minTrustScore && {
          trustScore: { gte: parseInt(minTrustScore, 10) },
        }),
        ...(isVerified === 'true' && {
          isVerified: true,
        }),
        ...(hasWebsite === 'true' && {
          website: { not: null },
        }),
        ...(hasInstagram === 'true' && {
          instagram: { not: null },
        }),
      },
      include: {
        banners: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        sentRequests: {
          where: { receiverBusiness: { userId: excludeUserId } },
        },
        receivedRequests: {
          where: { senderBusiness: { userId: excludeUserId } },
        },
      },
      orderBy: { name: 'asc' },
      skip: parseInt(skip, 10) || 0,
      take: parseInt(take, 10) || 12,
    });

    // Compute Metrics and Request Status
    return Promise.all(
      businesses.map(async (biz) => {
        // Completed promotions
        const completedCount = await this.prisma.promotion.count({
          where: {
            status: 'COMPLETED',
            OR: [
              { request: { senderBusinessId: biz.id } },
              { request: { receiverBusinessId: biz.id } },
            ],
          },
        });
        const totalPromotions = await this.prisma.promotion.count({
          where: {
            OR: [
              { request: { senderBusinessId: biz.id } },
              { request: { receiverBusinessId: biz.id } },
            ],
          },
        });
        const successRate =
          totalPromotions > 0
            ? Math.round((completedCount / totalPromotions) * 100)
            : 100;

        // Request status
        let requestStatus: any = null;
        if (biz.sentRequests.length > 0 || biz.receivedRequests.length > 0) {
          const reqs = [...biz.sentRequests, ...biz.receivedRequests];
          requestStatus = reqs[0].status; // simplifying: just taking the first related request status
        }

        return {
          ...biz,
          metrics: {
            completedPromotions: completedCount,
            successRate,
          },
          requestStatus,
        };
      }),
    );
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
    const scoredBusinesses = allBusinesses.map((biz) => {
      let score = 0;
      let reason = '';

      if (myBusiness) {
        if (biz.category === myBusiness.category) {
          score += 50;
          reason = `Both businesses operate in ${biz.category}.`;
        }
        if (
          myBusiness.city &&
          biz.city &&
          myBusiness.city.toLowerCase() === biz.city.toLowerCase()
        ) {
          score += 30;
          reason = reason
            ? `${reason} Both target local customers in ${biz.city}.`
            : `Both target local customers in ${biz.city}.`;
        }
        const myComplementary =
          this.getComplementaryMap()[myBusiness.category] || [];
        if (myComplementary.includes(biz.category)) {
          score += 20;
          reason =
            reason ||
            `${biz.category} is highly complementary to ${myBusiness.category}.`;
        }
      }

      return {
        ...biz,
        matchScore: score,
        matchReason: reason || 'General platform recommendation.',
      };
    });

    // Filter out scores of 0 and sort by score DESC
    return scoredBusinesses
      .filter((b) => b.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  // Saved Partners Feature
  async savePartner(userId: string, businessId: string) {
    const existing = await this.prisma.savedPartner.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });
    if (existing) return existing;

    return this.prisma.savedPartner.create({
      data: { userId, businessId },
    });
  }

  async unsavePartner(userId: string, businessId: string) {
    return this.prisma.savedPartner.deleteMany({
      where: { userId, businessId },
    });
  }

  async getSavedPartners(userId: string) {
    const saved = await this.prisma.savedPartner.findMany({
      where: { userId },
      include: {
        business: {
          include: {
            banners: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return saved.map((s) => s.business);
  }

  // Profile Details
  async getProfile(businessId: string, currentUserId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        banners: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!business) throw new NotFoundException('Business not found');

    const myBusiness = await this.prisma.business.findFirst({
      where: { userId: currentUserId },
    });

    // 1. Metrics
    const completedCount = await this.prisma.promotion.count({
      where: {
        status: 'COMPLETED',
        OR: [
          { request: { senderBusinessId: business.id } },
          { request: { receiverBusinessId: business.id } },
        ],
      },
    });
    const totalPromotions = await this.prisma.promotion.count({
      where: {
        OR: [
          { request: { senderBusinessId: business.id } },
          { request: { receiverBusinessId: business.id } },
        ],
      },
    });
    const successRate =
      totalPromotions > 0
        ? Math.round((completedCount / totalPromotions) * 100)
        : 100;

    // Simulated engagement metrics for MVP
    const totalEngagement =
      completedCount * 342 + Math.floor(Math.random() * 50);
    const avgClicks =
      completedCount > 0 ? 120 + Math.floor(Math.random() * 40) : 0;
    const avgQrScans =
      completedCount > 0 ? 45 + Math.floor(Math.random() * 20) : 0;

    // 2. Related Businesses
    const related = await this.prisma.business.findMany({
      where: {
        id: { not: business.id },
        category: business.category,
        city: business.city,
      },
      take: 3,
      include: {
        banners: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    // 3. Match Logic
    let matchScore = 0;
    let matchReason = '';
    if (myBusiness) {
      if (business.category === myBusiness.category) {
        matchScore += 50;
        matchReason = `Both businesses operate in ${business.category}.`;
      }
      if (
        myBusiness.city &&
        business.city &&
        myBusiness.city.toLowerCase() === business.city.toLowerCase()
      ) {
        matchScore += 30;
        matchReason = matchReason
          ? `${matchReason} Both target local customers in ${business.city}.`
          : `Both target local customers in ${business.city}.`;
      }
      const myComplementary =
        this.getComplementaryMap()[myBusiness.category] || [];
      if (myComplementary.includes(business.category)) {
        matchScore += 20;
        matchReason =
          matchReason ||
          `${business.category} is a highly complementary category.`;
      }
      if (!matchReason) matchReason = 'Similar audience and promotion goals.';
    }

    // 4. Recent Activity
    const recentActivity: any[] = [];
    if (completedCount > 0) {
      recentActivity.push({
        id: '1',
        title: 'Completed a promotion',
        description: 'Successfully finished a cross-promotion campaign.',
        date: new Date().toISOString(),
        type: 'promotion',
      });
      recentActivity.push({
        id: '2',
        title: 'Generated High Engagement',
        description: `Drove over ${avgClicks} clicks in recent promotion.`,
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'insight',
      });
    }
    if (business.trustScore > 50) {
      recentActivity.push({
        id: '3',
        title: 'Trust Score Increased',
        description: 'Earned positive feedback from partners.',
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'trust',
      });
    }
    recentActivity.push({
      id: '4',
      title: 'Joined Platform',
      description: 'Started their journey on 24HR Status Promotion.',
      date: business.createdAt.toISOString(),
      type: 'system',
    });

    // 5. Request Status
    let requestStatus: any = null;
    if (myBusiness) {
      const activeReq = await this.prisma.promotionRequest.findFirst({
        where: {
          OR: [
            {
              senderBusinessId: myBusiness.id,
              receiverBusinessId: business.id,
            },
            {
              senderBusinessId: business.id,
              receiverBusinessId: myBusiness.id,
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      if (activeReq) requestStatus = activeReq.status;
    }

    return {
      ...business,
      metrics: {
        completedPromotions: completedCount,
        successRate,
        totalEngagement,
        avgClicks,
        avgQrScans,
        completionRate: successRate,
      },
      relatedBusinesses: related,
      recentActivity,
      matchScore,
      matchReason,
      requestStatus,
    };
  }

  private getComplementaryMap(): Record<string, string[]> {
    return {
      Restaurant: ['Gym', 'Fitness', 'Cafe', 'Entertainment'],
      Gym: ['Restaurant', 'Health', 'Retail'],
      Fashion: ['Salon', 'Makeup', 'Jewelry', 'Photography'],
      Salon: ['Fashion', 'Makeup', 'Wedding'],
      Education: ['Coaching', 'Books', 'Technology'],
      Technology: ['Education', 'Electronics', 'Services'],
    };
  }
}
