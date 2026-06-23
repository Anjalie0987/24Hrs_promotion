import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'banners',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error)
              return reject(
                new InternalServerErrorException(
                  'Cloudinary Error: ' + error.message,
                ),
              );
            if (!result) {
              return reject(new InternalServerErrorException('Cloudinary Error: No result returned'));
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  getWatermarkedUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width: 800, crop: 'scale' },
        {
          color: '#FFFFFF',
          overlay: {
            font_family: 'Arial',
            font_size: 40,
            font_weight: 'bold',
            text: 'Preview%20-%2024Hrs',
          },
        },
        { flags: 'layer_apply', gravity: 'center', opacity: 50, angle: -30 },
      ],
    });
  }
}
