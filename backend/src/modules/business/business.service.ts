import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BannerTemplateType } from './banner/banner.types';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BannerService } from './banner/banner.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly bannerService: BannerService,
  ) {}

  async create(
    userId: string,
    dto: CreateBusinessDto,
    files?: {
      logo?: Express.Multer.File[];
      ownerPhoto?: Express.Multer.File[];
    },
  ) {
    const existing = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Business already exists for this user');
    }

    let logoUrl = dto.logoUrl;
    let ownerPhotoUrl = dto.ownerPhotoUrl;

    if (files?.logo?.[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        files.logo[0],
        'business_profiles',
      );
      logoUrl = uploadResult.secure_url;
    }

    if (files?.ownerPhoto?.[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        files.ownerPhoto[0],
        'business_profiles',
      );
      ownerPhotoUrl = uploadResult.secure_url;
    }

    const yearsExperience = dto.yearsExperience
      ? Number(dto.yearsExperience)
      : undefined;

    const createdBusiness = await this.prisma.business.create({
      data: {
        ...dto,
        logoUrl,
        ownerPhotoUrl,
        yearsExperience,
        bannerUrl: null, // Temporarily store bannerUrl = null
        userId,
      },
    });

    try {
      const bannerBuffer = await this.bannerService.generateBusinessBanner(
        {
          name: createdBusiness.name,
          category: createdBusiness.category,
          description: createdBusiness.description || undefined,
          location: createdBusiness.location || undefined,
          whatsapp: createdBusiness.whatsapp || undefined,
          website: createdBusiness.website || undefined,
          email: (createdBusiness as any).email || undefined,
          yearsExperience: createdBusiness.yearsExperience || undefined,
          logoUrl: createdBusiness.logoUrl || undefined,
          ownerPhotoUrl: createdBusiness.ownerPhotoUrl || undefined,
        },
        createdBusiness.bannerTemplate as unknown as BannerTemplateType,
      );

      const publicId = `business-${createdBusiness.id}`;
      const secureUrl = await this.cloudinaryService.uploadBuffer(
        bannerBuffer,
        'business-banners',
        publicId,
      );

      const cacheBustedUrl = `${secureUrl}?t=${Date.now()}`;

      // Save to My Banners list
      await this.prisma.banner.create({
        data: {
          originalImageUrl: cacheBustedUrl,
          watermarkedImageUrl: cacheBustedUrl,
          title: `Generated Banner - ${new Date().toLocaleDateString()}`,
          businessId: createdBusiness.id,
        },
      });

      await this.prisma.business.update({
        where: { id: createdBusiness.id },
        data: { bannerUrl: cacheBustedUrl },
      });

      createdBusiness.bannerUrl = cacheBustedUrl;
    } catch (error) {
      console.error(
        'Error generating/uploading banner for business:',
        createdBusiness.id,
        error,
      );
    }

    return createdBusiness;
  }

  async regenerateBanner(userId: string, businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to regenerate this banner',
      );
    }

    try {
      const bannerBuffer = await this.bannerService.generateBusinessBanner(
        {
          name: business.name,
          category: business.category,
          description: business.description || undefined,
          location: business.location || undefined,
          whatsapp: business.whatsapp || undefined,
          website: business.website || undefined,
          email: (business as any).email || undefined,
          yearsExperience: business.yearsExperience || undefined,
          logoUrl: business.logoUrl || undefined,
          ownerPhotoUrl: business.ownerPhotoUrl || undefined,
        },
        business.bannerTemplate as unknown as BannerTemplateType,
      );

      const publicId = `business-${business.id}`;
      const secureUrl = await this.cloudinaryService.uploadBuffer(
        bannerBuffer,
        'business-banners',
        publicId,
      );

      const cacheBustedUrl = `${secureUrl}?t=${Date.now()}`;

      // Save to My Banners list
      await this.prisma.banner.create({
        data: {
          originalImageUrl: cacheBustedUrl,
          watermarkedImageUrl: cacheBustedUrl,
          title: `Generated Banner - ${new Date().toLocaleDateString()}`,
          businessId: business.id,
        },
      });

      return this.prisma.business.update({
        where: { id: business.id },
        data: { bannerUrl: cacheBustedUrl },
      });
    } catch (error) {
      console.error('Failed to regenerate banner:', error);
      throw new InternalServerErrorException(
        'Failed to generate business banner',
        (error as any) instanceof Error ? (error as any).message : String(error),
      );
    }
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

  async update(
    userId: string,
    dto: UpdateBusinessDto,
    files?: {
      logo?: Express.Multer.File[];
      ownerPhoto?: Express.Multer.File[];
    },
  ) {
    const business = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    let logoUrl = dto.logoUrl;
    let ownerPhotoUrl = dto.ownerPhotoUrl;

    if (files?.logo?.[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        files.logo[0],
        'business_profiles',
      );
      logoUrl = uploadResult.secure_url;
    }

    if (files?.ownerPhoto?.[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        files.ownerPhoto[0],
        'business_profiles',
      );
      ownerPhotoUrl = uploadResult.secure_url;
    }

    const dataToUpdate: Prisma.BusinessUpdateInput = { ...dto };
    if (logoUrl !== undefined) dataToUpdate.logoUrl = logoUrl;
    if (ownerPhotoUrl !== undefined) dataToUpdate.ownerPhotoUrl = ownerPhotoUrl;

    if (dto.yearsExperience !== undefined) {
      dataToUpdate.yearsExperience = dto.yearsExperience
        ? Number(dto.yearsExperience)
        : null;
    }

    // Preserve existing bannerUrl by not overwriting it
    if ('bannerUrl' in dataToUpdate) {
      delete (dataToUpdate as any).bannerUrl;
    }

    await this.prisma.business.update({
      where: { id: business.id },
      data: dataToUpdate,
    });

    // Automatically regenerate the banner with the updated details
    return this.regenerateBanner(userId, business.id);
  }

  async findAll(
    excludeUserId: string,
    filters: {
      search?: string;
      category?: string;
      city?: string;
      state?: string;
      minTrustScore?: string;
      isVerified?: string;
      hasWebsite?: string;
      hasInstagram?: string;
      skip?: string;
      take?: string;
    } = {},
  ) {
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
      skip: Number(skip),
      take: Number(take),
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
        let requestStatus: string | null = null;
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
    let requestStatus: string | null = null;
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
