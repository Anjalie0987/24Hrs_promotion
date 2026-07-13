import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() data: Parameters<UsersService['updateProfile']>[1],
  ) {
    return this.usersService.updateProfile(req.user.userId, data);
  }
}
