import { UserHistoryMockFactory } from '../../../../test/factories/user/user-history-factory-mock';
import { UserHistoryRepositoryMock } from '../../../../test/repositories/user/user-history-repository-mock';
import { ListUserHistoryUseCase } from '../list-user-history-use-case';

describe('List User History Use Case', () => {
  let useCase: ListUserHistoryUseCase;

  beforeEach(() => {
    useCase = new ListUserHistoryUseCase(UserHistoryRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list all User History', async () => {
    // Arrange
    const mockUserHistory = UserHistoryMockFactory.createEntities(5);
    UserHistoryRepositoryMock.listUserHistory.mockResolvedValueOnce(
      mockUserHistory
    );

    // Act
    const result = await useCase.execute(mockUserHistory[0].userId);

    // Assert
    expect(UserHistoryRepositoryMock.listUserHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUserHistory);
  });
});
