import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';
import { IImageFloodAreaRepository } from '../../../domain/repositories/images-flood-area-storage/images-flood-area-repository';

export class ListPendingFloodAreaByUserIdUseCase {
  constructor(
    private floodAreaRepository: IFloodAreaRepository,
    private imageFloodAreaRepository: IImageFloodAreaRepository
  ) {}

  async execute(userId: number) {
    const pendingFloodAreas = await this.floodAreaRepository.listFloodAreas({
      userId: Number(userId),
      active: 'active',
      status: 'pending',
    });

    const pendingFloodAreasWithImages = await Promise.all(
      pendingFloodAreas.map(async (floodArea) => {
        const images = await this.imageFloodAreaRepository.getImages(
          floodArea.id
        );
        return {
          ...floodArea,
          images,
        };
      })
    );

    return pendingFloodAreasWithImages;
  }
}
