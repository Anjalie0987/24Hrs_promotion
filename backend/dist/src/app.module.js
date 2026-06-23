"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const business_module_1 = require("./modules/business/business.module");
const promotions_module_1 = require("./modules/promotions/promotions.module");
const banners_module_1 = require("./modules/banners/banners.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const requests_module_1 = require("./modules/requests/requests.module");
const schedule_1 = require("@nestjs/schedule");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const tracking_module_1 = require("./modules/tracking/tracking.module");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const email_module_1 = require("./modules/email/email.module");
const cloudinary_module_1 = require("./modules/cloudinary/cloudinary.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 15 * 60000,
                    limit: 1000,
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
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            business_module_1.BusinessModule,
            promotions_module_1.PromotionsModule,
            banners_module_1.BannersModule,
            analytics_module_1.AnalyticsModule,
            requests_module_1.RequestsModule,
            dashboard_module_1.DashboardModule,
            schedule_1.ScheduleModule.forRoot(),
            notifications_module_1.NotificationsModule,
            tracking_module_1.TrackingModule,
            email_module_1.EmailModule,
            cloudinary_module_1.CloudinaryModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map