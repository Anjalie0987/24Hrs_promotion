import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannersService } from './banners.service';
import { BusinessService } from '../business/business.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly businessService: BusinessService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { title?: string },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const business = await this.businessService.findMe(req.user.userId);
    return this.bannersService.create(business.id, file, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-banners')
  async getMyBanners(@Req() req: any) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.bannersService.findAllByBusiness(business.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const business = await this.businessService.findMe(req.user.userId);
    return this.bannersService.remove(id, business.id);
  }
}
