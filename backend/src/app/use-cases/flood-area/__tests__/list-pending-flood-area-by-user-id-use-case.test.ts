import { faker } from '@faker-js/faker';
import { FloodAreaMockFactory } from '../../../../test/factories/flood-area/flood-area-factory-mock';
import { FloodAreaRepositoryMock } from '../../../../test/repositories/flood-area/flood-area-repository-mock';
import { ImagesFloodAreaRepositoryMock } from '../../../../test/repositories/images-flood-area/images-flood-area-repository-mock';
import { ListPendingFloodAreaByUserIdUseCase } from '../list-pending-flood-area-by-user-id-use-case';

describe('List Flood Area ID Use Case', () => {
  let useCase: ListPendingFloodAreaByUserIdUseCase;

  beforeEach(() => {
    useCase = new ListPendingFloodAreaByUserIdUseCase(
      FloodAreaRepositoryMock,
      ImagesFloodAreaRepositoryMock
    );
    jest.clearAllMocks();
  });

  it('should list pending flood areas successfully', async () => {
    const mockFloodAreas = FloodAreaMockFactory.createEntities(3);
    const userId = faker.number.int();

    FloodAreaRepositoryMock.listFloodAreas.mockResolvedValue(mockFloodAreas);

    const result = await useCase.execute(userId);

    expect(FloodAreaRepositoryMock.listFloodAreas).toHaveBeenCalledTimes(1);
    expect(FloodAreaRepositoryMock.listFloodAreas).toHaveBeenCalledWith({
      userId: Number(userId),
      active: 'active',
      status: 'pending',
    });
    expect(result).toEqual(mockFloodAreas);
  });
});
