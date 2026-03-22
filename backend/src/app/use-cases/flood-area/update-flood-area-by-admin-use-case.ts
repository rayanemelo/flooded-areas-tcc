import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export type UpdateFloodAreaByAdminDTO = {
  active: boolean;
  status: string;
  commentsAdmin?: string | null;
};

export class UpdateFloodAreaByAdminUseCase {
  constructor(private floodAreaRepository: IFloodAreaRepository) {}

  async execute(id: number, body: UpdateFloodAreaByAdminDTO) {
    const floodAreaExists = await this.floodAreaRepository.getFloodAreaById(id);

    if (!floodAreaExists)
      throw new Exception(404, messages.response.floodAreaNotFound);

    const floodArea = await this.floodAreaRepository.updateFloodArea(id, body);

    return floodArea;
  }
}
