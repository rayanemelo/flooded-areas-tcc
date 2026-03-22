import { UserMockFactory } from '../../../../test/factories/user/user-factory-mock';
import { UserRepositoryMock } from '../../../../test/repositories/user/user-repository-mock';
import { ListUserUseCase } from '../list-users-use-case';

describe('List Users Use Case', () => {
  let useCase: ListUserUseCase;

  beforeEach(() => {
    useCase = new ListUserUseCase(UserRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list all Users', async () => {
    // Arrange
    const mockUsers = UserMockFactory.createEntities(5);
    UserRepositoryMock.listUsers.mockResolvedValueOnce(mockUsers);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(UserRepositoryMock.listUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
  });
});
