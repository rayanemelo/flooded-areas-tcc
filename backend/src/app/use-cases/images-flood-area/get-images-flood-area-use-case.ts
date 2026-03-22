import { ImagesFloodAreaEntity } from '../../../domain/entities/images-flood-area/images-flood-area-entity';
import { IImageFloodAreaRepository } from '../../../domain/repositories/images-flood-area-storage/images-flood-area-repository';

export class GetImagesFloodAreaUseCase {
  constructor(private imageFloodAreaRepository: IImageFloodAreaRepository) {}

  async execute(floodAreaId: number): Promise<ImagesFloodAreaEntity[]> {
    const images = await this.imageFloodAreaRepository.getImages(floodAreaId);

    return images;
  }
}
