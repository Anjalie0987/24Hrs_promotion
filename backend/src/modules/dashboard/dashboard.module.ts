import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { BusinessModule } from '../business/business.module';
import { BannersModule } from '../banners/banners.module';
import { RequestsModule } from '../requests/requests.module';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  imports: [
    PrismaModule,
    AnalyticsModule,
    BusinessModule,
    BannersModule,
    RequestsModule,
    PromotionsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
