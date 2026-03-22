import { ImageStorageMockFactory } from '../../../../test/factories/images-flood-area/image-storage-factory-mock';
import { ImageStorageRepositoryMock } from '../../../../test/repositories/images-flood-area/image-storage-repository-mock';
import { ImagesFloodAreaRepositoryMock } from '../../../../test/repositories/images-flood-area/images-flood-area-repository-mock';
import { CreateImageFloodAreaUseCase } from '../create-image-flood-area-use-case';
import { Base64 } from '../../../../infra/utils/base-64';
import { ImagesFloodAreaMockFactory } from '../../../../test/factories/images-flood-area/images-flood-area-factory-mock';
import { faker } from '@faker-js/faker';
import { Exception } from '../../../../infra/exception/exception';

jest.mock('../../../../infra/utils/base-64', () => ({
  Base64: {
    isBase64Image: jest.fn(),
  },
}));

describe('Create Image Flood Area Use Case', () => {
  let useCase: CreateImageFloodAreaUseCase;

  beforeEach(() => {
    useCase = new CreateImageFloodAreaUseCase(
      ImagesFloodAreaRepositoryMock,
      ImageStorageRepositoryMock
    );
    jest.clearAllMocks();
  });

  const mockImageBase64 = ImageStorageMockFactory.createEntity();
  const mockImages = ImagesFloodAreaMockFactory.createEntity();

  it('should get images flood area successfully', async () => {
    // Arrange
    const floodAreaId = faker.number.int();
    (Base64.isBase64Image as jest.Mock).mockReturnValue(true);
    ImageStorageRepositoryMock.uploadImageBase64.mockResolvedValueOnce(
      mockImageBase64
    );
    ImagesFloodAreaRepositoryMock.createImageFloodArea.mockResolvedValueOnce(
      mockImages
    );

    // Act
    const result = await useCase.execute(floodAreaId, mockImageBase64);

    // Assert
    expect(result).toEqual(mockImages);
    expect(Base64.isBase64Image).toHaveBeenCalledWith(mockImageBase64);
    expect(ImageStorageRepositoryMock.uploadImageBase64).toHaveBeenCalledWith(
      mockImageBase64
    );
    expect(
      ImagesFloodAreaRepositoryMock.createImageFloodArea
    ).toHaveBeenCalledWith(floodAreaId, mockImageBase64);
  });

  it('should throw an exception when image is not base64', async () => {
    // Arrange
    const floodAreaId = faker.number.int();
    (Base64.isBase64Image as jest.Mock).mockReturnValue(false);

    // Act & Assert
    await expect(useCase.execute(floodAreaId, mockImageBase64)).rejects.toThrow(
      Exception
    );
    expect(Base64.isBase64Image).toHaveBeenCalledWith(mockImageBase64);
  });
});
