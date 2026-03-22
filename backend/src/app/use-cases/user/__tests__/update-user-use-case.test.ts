import { faker } from '@faker-js/faker';
import { Exception } from '../../../../infra/exception/exception';
import { UpdateUserUseCase } from '../update-user-use-case';
import { UserRepositoryMock } from '../../../../test/repositories/user/user-repository-mock';
import { UserMockFactory } from '../../../../test/factories/user/user-factory-mock';

describe('Update User Use Case', () => {
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    useCase = new UpdateUserUseCase(UserRepositoryMock);
    jest.clearAllMocks();
  });

  it('should update an existing user', async () => {
    // Arrange
    const mockUser = UserMockFactory.createEntity();

    UserRepositoryMock.getUserById.mockResolvedValueOnce(mockUser);
    UserRepositoryMock.updateUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await useCase.execute(mockUser.id, {
      phone: mockUser.phone,
    });

    // Assert
    expect(UserRepositoryMock.getUserById).toHaveBeenCalledWith(mockUser.id);
    expect(UserRepositoryMock.updateUser).toHaveBeenCalledWith(
      mockUser.id,
      expect.objectContaining({
        phone: mockUser.phone,
      })
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if User doesnt exist', async () => {
    // Arrange
    const id = faker.number.int();
    const mockUser = UserMockFactory.createEntity();

    UserRepositoryMock.getUserById.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(useCase.execute(id, mockUser)).rejects.toThrow(Exception);

    expect(UserRepositoryMock.getUserById).toHaveBeenCalledWith(id);
    expect(UserRepositoryMock.updateUser).not.toHaveBeenCalled();
  });
});
