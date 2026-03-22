import { UserMockFactory } from '../../../../test/factories/user/user-factory-mock';
import { UserRepositoryMock } from '../../../../test/repositories/user/user-repository-mock';

import { faker } from '@faker-js/faker';

import { Exception } from '../../../../infra/exception/exception';
import { GetUserByIdUseCase } from '../get-user-by-id-use-case';

describe('Get User by ID Use Case', () => {
  let useCase: GetUserByIdUseCase;

  beforeEach(() => {
    useCase = new GetUserByIdUseCase(UserRepositoryMock);
    jest.clearAllMocks();
  });

  it('should get User by ID successfully', async () => {
    // Arrange
    const mockUser = UserMockFactory.createEntity();

    UserRepositoryMock.getUserById.mockResolvedValueOnce(mockUser);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw a not found exception when User does not exists', async () => {
    // Arrange
    const id = faker.number.int();

    UserRepositoryMock.getUserById.mockResolvedValueOnce(null);

    // Act
    await expect(useCase.execute(id)).rejects.toThrow(Exception);

    // Assert
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledTimes(1);
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledWith(id);
  });
});
