import { faker } from '@faker-js/faker';
import { CreateSessionUserAdminUseCase } from '../create-session-user-admin-use-case';
import { UserAdminRepositoryMock } from '../../../../../test/repositories/user-admin/user-admin-repository-mock';
import { ITokenService } from '../../../../../domain/services/token-service';
import { IHashService } from '../../../../../domain/services/hash-service';
import { UserAdminMockFactory } from '../../../../../test/factories/user-admin/user-admin-factory-mock';
import { messages } from '../../../../../infra/config/messages';
import { Exception } from '../../../../../infra/exception/exception';

export const TokenServiceMock: jest.Mocked<ITokenService> = {
  generateToken: jest.fn<string, [any]>(),
  verifyToken: jest.fn(),
};
export const HashServiceMock: jest.Mocked<IHashService> = {
  compare: jest.fn<Promise<boolean>, [string, string]>(),
  hash: jest.fn(),
};

describe('Create Session User Admin Use Case', () => {
  let useCase: CreateSessionUserAdminUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateSessionUserAdminUseCase(
      UserAdminRepositoryMock,
      TokenServiceMock,
      HashServiceMock
    );
  });

  it('should create session successfully when credentials are valid and user is active', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const mockUser = UserAdminMockFactory.createEntity({ email, password });

    UserAdminRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    HashServiceMock.compare.mockResolvedValue(true);
    TokenServiceMock.generateToken.mockReturnValue('mocked_token');

    const result = await useCase.execute(email, password);

    expect(UserAdminRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(HashServiceMock.compare).toHaveBeenCalledWith(
      password,
      mockUser.password
    );
    expect(TokenServiceMock.generateToken).toHaveBeenCalledWith({
      id: mockUser.id,
    });

    expect(result).toEqual({
      userAdmin: {
        id: mockUser.id,
        name: mockUser.name,
        active: mockUser.active,
      },
      token: 'mocked_token',
    });
  });

  it('should throw 404 if user does not exist', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    UserAdminRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(email, password)).rejects.toThrow(
      new Exception(404, messages.response.userNotFound)
    );

    expect(UserAdminRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(HashServiceMock.compare).not.toHaveBeenCalled();
    expect(TokenServiceMock.generateToken).not.toHaveBeenCalled();
  });

  it('should throw 401 if password does not match', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const mockUser = UserAdminMockFactory.createEntity({ email });

    UserAdminRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    HashServiceMock.compare.mockResolvedValue(false);

    await expect(useCase.execute(email, password)).rejects.toThrow(
      new Exception(401, messages.response.notAuthorized)
    );

    expect(UserAdminRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(HashServiceMock.compare).toHaveBeenCalled();
    expect(TokenServiceMock.generateToken).not.toHaveBeenCalled();
  });

  it('should throw 403 if user is inactive', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const mockUser = UserAdminMockFactory.createEntity({
      email,
      active: false,
    });

    UserAdminRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    HashServiceMock.compare.mockResolvedValue(true);

    await expect(useCase.execute(email, password)).rejects.toThrow(
      new Exception(403, messages.response.inactiveUser)
    );

    expect(UserAdminRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(HashServiceMock.compare).toHaveBeenCalled();
    expect(TokenServiceMock.generateToken).not.toHaveBeenCalled();
  });
});
