import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';
import { IImageFloodAreaRepository } from '../../../domain/repositories/images-flood-area-storage/images-flood-area-repository';

export class ListActiveFloodAreaUseCase {
  constructor(
    private floodAreaRepository: IFloodAreaRepository,
    private imageFloodAreaRepository: IImageFloodAreaRepository
  ) {}

  async execute() {
    const activeFloodAreas = await this.floodAreaRepository.listFloodAreas({
      active: 'active',
      status: 'completed',
    });

    const activeFloodAreasWithImages = await Promise.all(
      activeFloodAreas.map(async (floodArea) => {
        const images = await this.imageFloodAreaRepository.getImages(
          floodArea.id
        );
        return {
          ...floodArea,
          images,
        };
      })
    );

    return activeFloodAreasWithImages;
  }
}
