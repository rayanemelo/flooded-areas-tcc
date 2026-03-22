import { faker } from '@faker-js/faker';
import { Exception } from '../../../../infra/exception/exception';
import { FloodAreaMockFactory } from '../../../../test/factories/flood-area/flood-area-factory-mock';
import { FloodAreaRepositoryMock } from '../../../../test/repositories/flood-area/flood-area-repository-mock';
import { ImagesFloodAreaRepositoryMock } from '../../../../test/repositories/images-flood-area/images-flood-area-repository-mock';
import { GetFloodAreaByIdUseCase } from '../get-flood-area-by-id-use-case';

describe('Get Flood Area By ID Use Case', () => {
  let useCase: GetFloodAreaByIdUseCase;

  beforeEach(() => {
    useCase = new GetFloodAreaByIdUseCase(
      FloodAreaRepositoryMock,
      ImagesFloodAreaRepositoryMock
    );
    jest.clearAllMocks();
  });

  it('should get a flood area by id successfully', async () => {
    // Arrange
    const mockFloodArea = FloodAreaMockFactory.createEntity();

    FloodAreaRepositoryMock.getFloodAreaById.mockResolvedValueOnce(
      mockFloodArea
    );
    ImagesFloodAreaRepositoryMock.getImages.mockResolvedValueOnce([]);

    // Act
    const result = await useCase.execute(mockFloodArea.id);

    // Assert
    expect(result).toEqual({
      ...mockFloodArea,
      images: [],
    });
  });

  it('should throw an exception when flood area is not found', async () => {
    // Arrange
    const mockFloodAreaId = faker.number.int();

    FloodAreaRepositoryMock.getFloodAreaById.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(useCase.execute(mockFloodAreaId)).rejects.toThrow(Exception);
  });
});
