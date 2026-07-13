import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req: AuthenticatedRequest,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipVal = skip ? parseInt(skip, 10) : 0;
    const takeVal = take ? parseInt(take, 10) : 20;
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      skipVal,
      takeVal,
    );
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Delete('read-all')
  async deleteReadNotifications(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.deleteReadNotifications(req.user.userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.deleteNotification(id, req.user.userId);
  }
}
