import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor();
    uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse>;
    getWatermarkedUrl(publicId: string): string;
}
