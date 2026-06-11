import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY_CLOUDINARY,
            api_secret: process.env.API_SECRET_CLOUDINARY
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'voguehub_products' }, // Folder di Cloudinary
                (error, result) => {
                    if (error) return reject(new InternalServerErrorException(error.message));
                    if (!result) return reject(new InternalServerErrorException());
                    resolve(result);
                }
            );
            
            // Konversi buffer ke stream agar bisa di-upload
            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(new InternalServerErrorException(error.message));
                resolve(result);
            });
        });
    }
}