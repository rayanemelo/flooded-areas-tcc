import { UserMockFactory } from '../../../../test/factories/user/user-factory-mock';
import { UserRepositoryMock } from '../../../../test/repositories/user/user-repository-mock';
import { CreateUserUseCase } from '../create-user-use-case';

describe('Create User Use Case', () => {
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    useCase = new CreateUserUseCase(UserRepositoryMock);
    jest.clearAllMocks();
  });

  it('should create a new User', async () => {
    // Arrange
    const mockUser = UserMockFactory.createEntity();
    UserRepositoryMock.createUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await useCase.execute(mockUser);

    // Assert
    expect(UserRepositoryMock.createUser).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if User creation fails', async () => {
    // Arrange
    const mockUser = UserMockFactory.createEntity();
    const errorMessage = 'Error creating User';
    UserRepositoryMock.createUser.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(useCase.execute(mockUser)).rejects.toThrow(errorMessage);
  });
});
