import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
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
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'ownerPhoto', maxCount: 1 },
    ]),
  )
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBusinessDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      ownerPhoto?: Express.Multer.File[];
    },
  ) {
    return this.businessService.create(req.user.userId, dto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Req() req: AuthenticatedRequest) {
    return this.businessService.findMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'ownerPhoto', maxCount: 1 },
    ]),
  )
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateBusinessDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      ownerPhoto?: Express.Multer.File[];
    },
  ) {
    return this.businessService.update(req.user.userId, dto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  async getRecommended(@Req() req: AuthenticatedRequest) {
    return this.businessService.getRecommended(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all') // Added alias for better discovery
  async findAllAlias(
    @Req() req: AuthenticatedRequest,
    @Query() query: Parameters<BusinessService['findAll']>[1],
  ) {
    return this.businessService.findAll(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved')
  async getSavedPartners(@Req() req: AuthenticatedRequest) {
    return this.businessService.getSavedPartners(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: Parameters<BusinessService['findAll']>[1],
  ) {
    return this.businessService.findAll(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  async savePartner(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.businessService.savePartner(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/save')
  async unsavePartner(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.businessService.unsavePartner(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  async getProfile(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.businessService.getProfile(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/regenerate-banner')
  async regenerateBanner(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.businessService.regenerateBanner(req.user.userId, id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }
}
