import { ImagesFloodAreaEntity } from '../../../domain/entities/images-flood-area/images-flood-area-entity';
import { IImageFloodAreaRepository } from '../../../domain/repositories/images-flood-area-storage/images-flood-area-repository';

export const ImagesFloodAreaRepositoryMock: jest.Mocked<IImageFloodAreaRepository> =
  {
    createImageFloodArea: jest.fn<
      Promise<ImagesFloodAreaEntity>,
      [number, string]
    >(),
    getImages: jest.fn<Promise<ImagesFloodAreaEntity[]>, [number]>(),
  };
