import { IImageStorageRepository } from '../../../domain/repositories/images-flood-area-storage/image-storage-repository';

export const ImageStorageRepositoryMock: jest.Mocked<IImageStorageRepository> =
  {
    uploadImageBase64: jest.fn<Promise<string>, [string]>(),
  };
