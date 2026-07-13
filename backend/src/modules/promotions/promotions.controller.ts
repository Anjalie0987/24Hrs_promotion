import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
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
  async findActive(
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.promotionsService.findActive(
      business.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('completed')
  async findCompleted(
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.promotionsService.findCompleted(
      business.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-proof')
  async uploadProof(
    @Req() req: AuthenticatedRequest,
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
