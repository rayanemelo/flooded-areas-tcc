import { Exception } from '../../../../infra/exception/exception';
import { UserAdminMockFactory } from '../../../../test/factories/user-admin/user-admin-factory-mock';
import { UserAdminRepositoryMock } from '../../../../test/repositories/user-admin/user-admin-repository-mock';
import { CreateUserAdminUseCase } from '../create-user-admin-use-case';

describe('Create User Admin Use Case', () => {
  let useCase: CreateUserAdminUseCase;

  beforeEach(() => {
    useCase = new CreateUserAdminUseCase(UserAdminRepositoryMock);
    jest.clearAllMocks();
  });

  it('should create a user admin successfully', async () => {
    const mockUserAdmin = UserAdminMockFactory.createEntity();
    UserAdminRepositoryMock.createUserAdmin.mockResolvedValueOnce(
      mockUserAdmin
    );

    const result = await useCase.execute(mockUserAdmin);

    expect(UserAdminRepositoryMock.createUserAdmin).toHaveBeenCalledWith(
      mockUserAdmin
    );
    expect(result).toEqual(mockUserAdmin);
  });

  it('should throw an error if user admin creation fails', async () => {
    const mockUserAdmin = UserAdminMockFactory.createEntity();

    UserAdminRepositoryMock.createUserAdmin.mockRejectedValueOnce(
      new Exception(400, 'Não foi possível criar o usuário')
    );

    await expect(useCase.execute(mockUserAdmin)).rejects.toThrow(Exception);
  });
});
