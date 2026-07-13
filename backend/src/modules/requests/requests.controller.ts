import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from '../business/business.service';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly businessService: BusinessService,
  ) {}

  @Post('send')
  async send(
    @Req() req: AuthenticatedRequest,
    @Body() data: { receiverBusinessId: string; bannerId: string },
  ) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.requestsService.send(business.id, data);
  }

  @Post('accept/:id')
  async accept(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.requestsService.accept(id, business.id);
  }

  @Post('reject/:id')
  async reject(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.requestsService.reject(id, business.id);
  }

  @Delete('cancel/:id')
  async cancel(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.requestsService.cancel(id, business.id);
  }

  @Get('incoming')
  async findIncoming(
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.requestsService.findIncoming(
      business.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
  }

  @Get('sent')
  async findSent(
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.requestsService.findSent(
      business.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
  }
}
