import { BannersService } from './banners.service';
import { BusinessService } from '../business/business.service';
export declare class BannersController {
    private readonly bannersService;
    private readonly businessService;
    constructor(bannersService: BannersService, businessService: BusinessService);
    upload(req: any, file: Express.Multer.File, data: {
        title?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }>;
    getMyBanners(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }[]>;
    delete(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }>;
}
