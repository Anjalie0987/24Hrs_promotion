import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from '../business/business.service';

@Controller('promotions')
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly businessService: BusinessService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('active')
  async findActive(@Req() req: any) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.promotionsService.findActive(business.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll(@Req() req: any) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.promotionsService.findAll(business.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-proof')
  async uploadProof(
    @Req() req: any,
    @Body() dto: { promotionId: string; proofImageUrl: string },
  ) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.promotionsService.uploadProof(
      dto.promotionId,
      business.id,
      dto.proofImageUrl,
    );
  }
}
