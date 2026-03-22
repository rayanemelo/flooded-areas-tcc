import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';
import { IImageFloodAreaRepository } from '../../../domain/repositories/images-flood-area-storage/images-flood-area-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class GetFloodAreaByIdUseCase {
  constructor(
    private floodAreaRepository: IFloodAreaRepository,
    private imageFloodAreaRepository: IImageFloodAreaRepository
  ) {}

  async execute(id: number) {
    const floodAreas = await this.floodAreaRepository.getFloodAreaById(id);

    if (!floodAreas)
      throw new Exception(404, messages.response.floodAreaNotFound);

    const images = await this.imageFloodAreaRepository.getImages(floodAreas.id);

    return {
      ...floodAreas,
      images,
    };
  }
}
