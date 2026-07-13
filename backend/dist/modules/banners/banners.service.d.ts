import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class BannersService {
    private readonly prisma;
    private readonly cloudinary;
    constructor(prisma: PrismaService, cloudinary: CloudinaryService);
    create(businessId: string, file: Express.Multer.File, data: {
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
    findAllByBusiness(businessId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }[]>;
    remove(id: string, businessId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        businessId: string;
    }>;
}
