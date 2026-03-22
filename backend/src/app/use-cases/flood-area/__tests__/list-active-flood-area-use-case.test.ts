import { FloodAreaMockFactory } from '../../../../test/factories/flood-area/flood-area-factory-mock';
import { ImagesFloodAreaMockFactory } from '../../../../test/factories/images-flood-area/images-flood-area-factory-mock';
import { FloodAreaRepositoryMock } from '../../../../test/repositories/flood-area/flood-area-repository-mock';
import { ImagesFloodAreaRepositoryMock } from '../../../../test/repositories/images-flood-area/images-flood-area-repository-mock';
import { ListActiveFloodAreaUseCase } from '../list-active-flood-area-use-case';

describe('List Active Flood Area ID Use Case', () => {
  let useCase: ListActiveFloodAreaUseCase;

  beforeEach(() => {
    useCase = new ListActiveFloodAreaUseCase(
      FloodAreaRepositoryMock,
      ImagesFloodAreaRepositoryMock
    );
    jest.clearAllMocks();
  });

  it('should list active flood areas successfully', async () => {
    const mockFloodAreas = FloodAreaMockFactory.createEntities(3);
    const mockImages = [ImagesFloodAreaMockFactory.createEntity()];

    FloodAreaRepositoryMock.listFloodAreas.mockResolvedValue(mockFloodAreas);

    ImagesFloodAreaRepositoryMock.getImages.mockResolvedValue(mockImages);

    const result = await useCase.execute();

    expect(FloodAreaRepositoryMock.listFloodAreas).toHaveBeenCalledWith({
      active: 'active',
      status: 'completed',
    });

    expect(ImagesFloodAreaRepositoryMock.getImages).toHaveBeenCalledTimes(3);
    mockFloodAreas.forEach((floodArea, index) => {
      expect(ImagesFloodAreaRepositoryMock.getImages).toHaveBeenCalledWith(
        floodArea.id
      );
      expect(result[index]).toEqual({
        ...floodArea,
        images: mockImages,
      });
    });

    expect(result).toHaveLength(3);
  });
});
