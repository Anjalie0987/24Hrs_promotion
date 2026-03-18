import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { BannersModule } from './modules/banners/banners.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, 
    UsersModule, 
    BusinessesModule, 
    PromotionsModule, 
    BannersModule, 
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
