import { faker } from '@faker-js/faker';
import { FloodAreaRepositoryMock } from '../../../../test/repositories/flood-area/flood-area-repository-mock';
import { UpdateFloodAreaByUserUseCase } from '../update-flood-area-by-user-use-case';
import { FloodAreaMockFactory } from '../../../../test/factories/flood-area/flood-area-factory-mock';
import { Exception } from '../../../../infra/exception/exception';
import { messages } from '../../../../infra/config/messages';

describe('Update Flood Area By User Use Case', () => {
  let useCase: UpdateFloodAreaByUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateFloodAreaByUserUseCase(FloodAreaRepositoryMock);
  });

  it('should update flood area by user successfully', async () => {
    const mockFloodArea = FloodAreaMockFactory.createEntity();

    const updateData = {
      id: mockFloodArea.id,
      yesCount: mockFloodArea.yesCount + 1,
      noCount: mockFloodArea.noCount,
    };

    FloodAreaRepositoryMock.getFloodAreaById = jest
      .fn()
      .mockResolvedValue(mockFloodArea);

    FloodAreaRepositoryMock.updateFloodArea = jest
      .fn()
      .mockResolvedValue({ ...mockFloodArea, ...updateData });

    const result = await useCase.execute(updateData);

    expect(FloodAreaRepositoryMock.getFloodAreaById).toHaveBeenCalledWith(
      updateData.id
    );
    expect(FloodAreaRepositoryMock.updateFloodArea).toHaveBeenCalledWith(
      updateData.id,
      updateData
    );
    expect(result).toEqual({ ...mockFloodArea, ...updateData });
  });

  it('should throw exception when flood area does not exist', async () => {
    const updateData = {
      id: faker.number.int(),
      yesCount: 1,
      noCount: 0,
    };

    FloodAreaRepositoryMock.getFloodAreaById = jest
      .fn()
      .mockResolvedValue(null);

    await expect(useCase.execute(updateData)).rejects.toThrow(
      new Exception(404, messages.response.floodAreaNotFound)
    );

    expect(FloodAreaRepositoryMock.getFloodAreaById).toHaveBeenCalledWith(
      updateData.id
    );
    expect(FloodAreaRepositoryMock.updateFloodArea).not.toHaveBeenCalled();
  });
});
