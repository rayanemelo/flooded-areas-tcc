import { ImagesFloodAreaEntity } from '../../../domain/entities/images-flood-area/images-flood-area-entity';
import { IImageStorageRepository } from '../../../domain/repositories/images-flood-area-storage/image-storage-repository';
import { IImageFloodAreaRepository } from '../../../domain/repositories/images-flood-area-storage/images-flood-area-repository';
import { Exception } from '../../../infra/exception/exception';
import { Base64 } from '../../../infra/utils/base-64';

export class CreateImageFloodAreaUseCase {
  constructor(
    private imageFloodAreaRepository: IImageFloodAreaRepository,
    private imageStorageRepository: IImageStorageRepository
  ) {}

  async execute(
    floodAreaId: number,
    image: string
  ): Promise<ImagesFloodAreaEntity> {
    const isBase64Image = Base64.isBase64Image(image);

    if (!isBase64Image) throw new Exception(400, 'Image is not a valid base64');

    const imageFloodArea =
      await this.imageStorageRepository.uploadImageBase64(image);

    const imageEntity =
      await this.imageFloodAreaRepository.createImageFloodArea(
        floodAreaId,
        imageFloodArea
      );

    return imageEntity;
  }
}
