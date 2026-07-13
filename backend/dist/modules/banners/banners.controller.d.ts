import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { BannersService } from './banners.service';
import { BusinessService } from '../business/business.service';
export declare class BannersController {
    private readonly bannersService;
    private readonly businessService;
    constructor(bannersService: BannersService, businessService: BusinessService);
    upload(req: AuthenticatedRequest, file: Express.Multer.File, data: {
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
    getMyBanners(req: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }[]>;
    delete(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }>;
}
