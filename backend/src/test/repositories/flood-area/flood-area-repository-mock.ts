import { FloodAreaEntity } from '../../../domain/entities/flood-area/flood-area-entity';
import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';

export const FloodAreaRepositoryMock: jest.Mocked<IFloodAreaRepository> = {
  listFloodAreas: jest.fn<Promise<FloodAreaEntity[]>, []>(),
  getFloodAreaById: jest.fn<Promise<FloodAreaEntity>, [number]>(),
  createFloodArea: jest.fn<Promise<FloodAreaEntity>, [FloodAreaEntity]>(),
  updateFloodArea: jest.fn<
    Promise<FloodAreaEntity>,
    [number, Partial<FloodAreaEntity>]
  >(),
};
