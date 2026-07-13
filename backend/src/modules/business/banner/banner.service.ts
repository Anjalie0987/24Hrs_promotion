import { Injectable, Logger } from '@nestjs/common';
import { BannerData, BannerTemplateType } from './banner.types';
import { generateBannerByTemplate } from './banner.factory';

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  async generateBusinessBanner(
    data: BannerData,
    template: BannerTemplateType = 'corporate',
  ): Promise<Buffer> {
    this.logger.log(
      `Generating banner for business: ${data.name} using template: ${template}`,
    );
    try {
      const buffer = await generateBannerByTemplate(data, template);
      this.logger.log(`Banner generated successfully for: ${data.name}`);
      return buffer;
    } catch (error) {
      this.logger.error(`Failed to generate banner for ${data.name}`, error);
      throw error;
    }
  }

  // Future methods can be added here:
  // async generateBusinessCard(data: any): Promise<Buffer> { ... }
  // async generateSocialMediaPost(data: any): Promise<Buffer> { ... }
}
