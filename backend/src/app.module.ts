import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { BannersModule } from './modules/banners/banners.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RequestsModule } from './modules/requests/requests.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EmailModule } from './modules/email/email.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 15 * 60000, // 15 minutes
        limit: 1000, // 1000 requests per 15 mins for public/default routes
      },
      {
        name: 'login',
        ttl: 15 * 60000,
        limit: 20,
      },
      {
        name: 'signup',
        ttl: 15 * 60000,
        limit: 10,
      },
      {
        name: 'dashboard',
        ttl: 15 * 60000,
        limit: 500,
      },
      {
        name: 'analytics',
        ttl: 15 * 60000,
        limit: 500,
      },
    ]),
    AuthModule,
    UsersModule,
    BusinessModule,
    PromotionsModule,
    BannersModule,
    AnalyticsModule,
    RequestsModule,
    DashboardModule,
    ScheduleModule.forRoot(),
    NotificationsModule,
    TrackingModule,
    EmailModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
