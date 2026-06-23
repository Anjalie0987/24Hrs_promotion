import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'business_profiles',
    );
    return { secure_url: uploadResult.secure_url };
  }

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
  @Get('all') // Added alias for better discovery
  async findAllAlias(@Req() req: any, @Query() query: any) {
    return this.businessService.findAll(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved')
  async getSavedPartners(@Req() req: any) {
    return this.businessService.getSavedPartners(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any, @Query() query: any) {
    return this.businessService.findAll(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  async savePartner(@Req() req: any, @Param('id') id: string) {
    return this.businessService.savePartner(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/save')
  async unsavePartner(@Req() req: any, @Param('id') id: string) {
    return this.businessService.unsavePartner(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  async getProfile(@Req() req: any, @Param('id') id: string) {
    return this.businessService.getProfile(id, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }
}
