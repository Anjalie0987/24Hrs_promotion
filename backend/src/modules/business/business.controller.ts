import { Controller, Get, Post, Put, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req: any, @Body() dto: CreateBusinessDto) {
    return this.businessService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Req() req: any) {
    return this.businessService.findMe(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Req() req: any, @Body() dto: UpdateBusinessDto) {
    return this.businessService.update(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  async getRecommended(@Req() req: any) {
    return this.businessService.getRecommended(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: any,
    @Query() query: { search?: string; category?: string; location?: string }
  ) {
    return this.businessService.findAll(req.user.userId, query);
  }
}
