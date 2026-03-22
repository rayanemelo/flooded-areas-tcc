import { FloodAreaMockFactory } from '../../../../test/factories/flood-area/flood-area-factory-mock';
import { FloodAreaRepositoryMock } from '../../../../test/repositories/flood-area/flood-area-repository-mock';
import { ListFloodAreaUseCase } from '../list-flood-area-use-case';

describe('List Flood Area ID Use Case', () => {
  let useCase: ListFloodAreaUseCase;

  beforeEach(() => {
    useCase = new ListFloodAreaUseCase(FloodAreaRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list flood areas successfully', async () => {
    const mockFloodAreas = FloodAreaMockFactory.createEntities(3);

    FloodAreaRepositoryMock.listFloodAreas.mockResolvedValue(mockFloodAreas);

    const result = await useCase.execute();

    expect(FloodAreaRepositoryMock.listFloodAreas).toHaveBeenCalledTimes(1);
    expect(FloodAreaRepositoryMock.listFloodAreas).toHaveBeenCalledWith();
    expect(result).toEqual(mockFloodAreas);
  });
});
