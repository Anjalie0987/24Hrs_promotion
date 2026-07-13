import { BannerData, BannerTemplateType } from './banner.types';
export declare class BannerService {
    private readonly logger;
    generateBusinessBanner(data: BannerData, template?: BannerTemplateType): Promise<Buffer>;
}
