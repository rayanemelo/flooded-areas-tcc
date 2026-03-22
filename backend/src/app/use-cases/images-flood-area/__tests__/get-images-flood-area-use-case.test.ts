import { GetImagesFloodAreaUseCase } from '../get-images-flood-area-use-case';
import { ImagesFloodAreaRepositoryMock } from '../../../../test/repositories/images-flood-area/images-flood-area-repository-mock';
import { ImagesFloodAreaMockFactory } from '../../../../test/factories/images-flood-area/images-flood-area-factory-mock';

describe('Get Images Flood Area Use Case', () => {
  let useCase: GetImagesFloodAreaUseCase;

  beforeEach(() => {
    useCase = new GetImagesFloodAreaUseCase(ImagesFloodAreaRepositoryMock);
    jest.clearAllMocks();
  });

  it('should get images flood area successfully', async () => {
    // Arrange
    const mockImagesFloodArea = ImagesFloodAreaMockFactory.createEntities(5);

    ImagesFloodAreaRepositoryMock.getImages.mockResolvedValueOnce(
      mockImagesFloodArea
    );

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(ImagesFloodAreaRepositoryMock.getImages).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockImagesFloodArea);
  });
});
