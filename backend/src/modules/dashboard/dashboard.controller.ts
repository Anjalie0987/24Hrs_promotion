import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Throttle({ default: { limit: 500, ttl: 900000 } })
  @Get('summary')
  async getSummary(@Request() req: any) {
    return this.dashboardService.getSummary(req.user.userId);
  }
}
