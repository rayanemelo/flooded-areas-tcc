import { faker } from '@faker-js/faker';

import { Exception } from '../../../../infra/exception/exception';
import { DeleteUserUseCase } from '../delete-user-use-case';
import { UserRepositoryMock } from '../../../../test/repositories/user/user-repository-mock';
import { UserMockFactory } from '../../../../test/factories/user/user-factory-mock';

describe('Delete User Use Case', () => {
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    useCase = new DeleteUserUseCase(UserRepositoryMock);
    jest.clearAllMocks();
  });

  it('should delete User by ID successfully', async () => {
    // Arrange
    const id = faker.number.int();
    const mockUser = UserMockFactory.createEntity();

    UserRepositoryMock.getUserById.mockResolvedValueOnce(mockUser);

    // Act
    const result = await useCase.execute(id);

    // Assert
    expect(result).toBeUndefined();
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledTimes(1);
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledWith(id);
    expect(UserRepositoryMock.deleteUser).toHaveBeenCalledTimes(1);
    expect(UserRepositoryMock.deleteUser).toHaveBeenCalledWith(id);
  });

  it('should throw a not found exception when User does not exists', async () => {
    // Arrange
    const id = faker.number.int();

    UserRepositoryMock.getUserById.mockResolvedValueOnce(null);

    // Act
    await expect(useCase.execute(id)).rejects.toThrow(Exception);
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledTimes(1);

    // Assert
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledTimes(1);
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledWith(id);
    expect(UserRepositoryMock.deleteUser).not.toHaveBeenCalled();
  });
});
