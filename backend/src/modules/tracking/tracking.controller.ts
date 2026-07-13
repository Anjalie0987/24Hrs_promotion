import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  Post,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('click/:id')
  async trackClick(
    @Param('id') promotionId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.socket.remoteAddress,
    };

    try {
      const redirectUrl = await this.trackingService.trackClick(
        promotionId,
        reqInfo,
      );
      return res.redirect(redirectUrl);
    } catch {
      // Fallback redirect if something goes wrong
      const fallbackUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(fallbackUrl);
    }
  }

  @Get('qr/:id')
  async trackQrScan(
    @Param('id') promotionId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.socket.remoteAddress,
    };

    try {
      const redirectUrl = await this.trackingService.trackQrScan(
        promotionId,
        reqInfo,
      );
      return res.redirect(redirectUrl);
    } catch {
      const fallbackUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(fallbackUrl);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('download/:id')
  async trackDownload(
    @Param('id') promotionId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    const result = await this.trackingService.trackBannerDownload(
      promotionId,
      userId,
    );
    return { success: true, data: result };
  }
}
