import { v2 as cloudinary } from 'cloudinary';
import { IImageStorageRepository } from '../../domain/repositories/images-flood-area-storage/image-storage-repository';

export class ImageStorageCloudinary implements IImageStorageRepository {
  public async uploadImageBase64(imageBase64: string): Promise<string> {
    const image = await cloudinary.uploader.upload(imageBase64, {
      resource_type: 'image',
    });
    return image.secure_url;
  }
}
