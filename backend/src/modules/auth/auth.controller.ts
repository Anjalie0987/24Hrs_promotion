import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SendOtpDto, VerifyOtpDto, ResetPasswordDto } from './dto/otp.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @Post('send-signup-otp')
  async sendSignupOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendSignupOtp(dto);
  }

  @Throttle({ default: { limit: 10, ttl: 900000 } })
  @Post('verify-signup-otp')
  async verifySignupOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifySignupOtp(dto);
  }

  @Throttle({ default: { limit: 10, ttl: 900000 } })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: SendOtpDto) {
    return this.authService.forgotPassword(dto);
  }

  @Throttle({ default: { limit: 10, ttl: 900000 } })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Throttle({ default: { limit: 20, ttl: 900000 } })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
