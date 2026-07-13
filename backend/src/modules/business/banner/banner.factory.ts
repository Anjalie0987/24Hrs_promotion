import { BannerData, BannerTemplateType } from './banner.types';
import { generateCorporateBanner } from './templates/corporate.template';

export async function generateBannerByTemplate(
  data: BannerData,
  template: BannerTemplateType = 'corporate',
): Promise<Buffer> {
  switch (template) {
    case 'corporate':
      return generateCorporateBanner(data);
    case 'modern':
    case 'minimal':
    case 'festival':
      // Fallback for unimplemented templates to corporate, or you could throw an error.
      // The instructions mention: "Only implement the 'corporate' template for now."
      return generateCorporateBanner(data);
    default:
      throw new Error(`Unsupported banner template: ${String(template)}`);
  }
}
