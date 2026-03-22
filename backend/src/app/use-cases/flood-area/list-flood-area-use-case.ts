import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';

export class ListFloodAreaUseCase {
  constructor(private floodAreaRepository: IFloodAreaRepository) {}

  async execute() {
    const floodAreas = await this.floodAreaRepository.listFloodAreas();
    return floodAreas;
  }
}
