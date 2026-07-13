"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendSignupOtp(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentOtps = await this.prisma.otp.count({
            where: {
                email: data.email,
                type: 'SIGNUP',
                createdAt: { gte: fifteenMinsAgo },
            },
        });
        if (recentOtps >= 3) {
            throw new common_1.BadRequestException('Too many OTP requests. Please try again later.');
        }
        await this.prisma.otp.deleteMany({
            where: { email: data.email, type: 'SIGNUP', isUsed: false },
        });
        const code = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.otp.create({
            data: {
                email: data.email,
                code,
                type: 'SIGNUP',
                expiresAt,
            },
        });
        await this.emailService.sendOtpEmail(data.email, code);
        return { success: true, message: 'OTP sent successfully' };
    }
    async verifySignupOtp(data) {
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                email: data.email,
                code: data.otp,
                type: 'SIGNUP',
                isUsed: false,
            },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        await this.prisma.otp.update({
            where: { id: otpRecord.id },
            data: { isUsed: true },
        });
        return { verified: true };
    }
    async signup(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const { password: rawPassword, ...userData } = data;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                isEmailVerified: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isEmailVerified: true,
            },
        });
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user,
        };
    }
    async forgotPassword(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            return {
                success: true,
                message: 'If that email is registered, an OTP has been sent.',
            };
        }
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentOtps = await this.prisma.otp.count({
            where: {
                email: data.email,
                type: 'RESET_PASSWORD',
                createdAt: { gte: fifteenMinsAgo },
            },
        });
        if (recentOtps >= 3) {
            throw new common_1.BadRequestException('Too many OTP requests. Please try again later.');
        }
        await this.prisma.otp.deleteMany({
            where: { email: data.email, type: 'RESET_PASSWORD', isUsed: false },
        });
        const code = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.otp.create({
            data: {
                email: data.email,
                code,
                type: 'RESET_PASSWORD',
                expiresAt,
            },
        });
        await this.emailService.sendOtpEmail(data.email, code);
        return { success: true, message: 'OTP sent successfully' };
    }
    async resetPassword(data) {
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                email: data.email,
                code: data.otp,
                type: 'RESET_PASSWORD',
                isUsed: false,
            },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        await this.prisma.otp.update({
            where: { id: otpRecord.id },
            data: { isUsed: true },
        });
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await this.prisma.user.update({
            where: { email: data.email },
            data: { password: hashedPassword },
        });
        return { success: true, message: 'Password reset successfully' };
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
            include: {
                business: {
                    include: {
                        banners: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isEmailVerified) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { isEmailVerified: true },
            });
            user.isEmailVerified = true;
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isEmailVerified: user.isEmailVerified,
                business: user.business,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map