import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor();
    uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse>;
    uploadBuffer(buffer: Buffer, folder?: string, publicId?: string): Promise<string>;
    getWatermarkedUrl(publicId: string): string;
}
