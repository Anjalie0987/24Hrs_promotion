import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
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
  async send(@Req() req, @Body() data: { receiverBusinessId: string; bannerId: string }) {
    const business = await this.businessService.findMe(req.user.id);
    return this.requestsService.send(business.id, data);
  }

  @Post('accept/:id')
  async accept(@Req() req, @Param('id') id: string) {
    const business = await this.businessService.findMe(req.user.id);
    return this.requestsService.accept(id, business.id);
  }

  @Post('reject/:id')
  async reject(@Req() req, @Param('id') id: string) {
    const business = await this.businessService.findMe(req.user.id);
    return this.requestsService.reject(id, business.id);
  }

  @Get('incoming')
  async findIncoming(@Req() req) {
    const business = await this.businessService.findMe(req.user.id);
    return this.requestsService.findIncoming(business.id);
  }

  @Get('sent')
  async findSent(@Req() req) {
    const business = await this.businessService.findMe(req.user.id);
    return this.requestsService.findSent(business.id);
  }
}
