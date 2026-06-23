import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendSignupOtp(data: { email: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Check rate limit: Max 3 OTPs per 15 minutes per email
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOtps = await this.prisma.otp.count({
      where: {
        email: data.email,
        type: 'SIGNUP',
        createdAt: { gte: fifteenMinsAgo },
      },
    });

    if (recentOtps >= 3) {
      throw new BadRequestException(
        'Too many OTP requests. Please try again later.',
      );
    }

    // Delete unused old OTPs for this email to prevent spam
    await this.prisma.otp.deleteMany({
      where: { email: data.email, type: 'SIGNUP', isUsed: false },
    });

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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

  async verifySignupOtp(data: { email: string; otp: string }) {
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email: data.email,
        code: data.otp,
        type: 'SIGNUP',
        isUsed: false,
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    return { verified: true };
  }

  async signup(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
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

  async forgotPassword(data: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      // Don't leak if user exists
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
      throw new BadRequestException(
        'Too many OTP requests. Please try again later.',
      );
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

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email: data.email,
        code: data.otp,
        type: 'RESET_PASSWORD',
        isUsed: false,
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
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

  async login(data: { email: string; password: string }) {
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      // For legacy users without verification
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
}
