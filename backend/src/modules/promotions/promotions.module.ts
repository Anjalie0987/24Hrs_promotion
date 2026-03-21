import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BusinessModule } from '../business/business.module';
import { PromotionsCron } from './promotions.cron';

@Module({
  imports: [PrismaModule, BusinessModule],
  controllers: [PromotionsController],
  providers: [PromotionsService, PromotionsCron],
  exports: [PromotionsService],
})
export class PromotionsModule {}
