import { messages } from '../../../../../infra/config/messages';
import { CodeMockFactory } from '../../../../../test/factories/code/code-factory-mock';
import { UserMockFactory } from '../../../../../test/factories/user/user-factory-mock';
import { CodeRepositoryMock } from '../../../../../test/repositories/code/code-repository-mock';
import { UserRepositoryMock } from '../../../../../test/repositories/user/user-repository-mock';
import { TokenServiceMock } from '../../auth-user-admin/__tests__/create-session-user-admin-use-case.test';
import { ValidateCodeUseCase } from '../validate-code-use-case';

describe('Validate Code Use Case', () => {
  let useCase: ValidateCodeUseCase;

  beforeEach(() => {
    useCase = new ValidateCodeUseCase(
      UserRepositoryMock,
      CodeRepositoryMock,
      TokenServiceMock
    );
    jest.clearAllMocks();
  });

  it('should throw error if user is not found', async () => {
    UserRepositoryMock.getUserByPhone.mockResolvedValue(null);

    await expect(useCase.execute('99999999999', '123456')).rejects.toThrow(
      messages.response.userNotFound
    );
  });

  it('should throw error if code is not found', async () => {
    const user = UserMockFactory.createEntity();

    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(null);

    await expect(useCase.execute(user.phone, '123456')).rejects.toThrow(
      messages.response.codeNotFound
    );
  });

  it('should throw error if code is invalid', async () => {
    const user = UserMockFactory.createEntity();
    const code = CodeMockFactory.createEntity({ code: '654321' }); // diferente

    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(code);

    await expect(useCase.execute(user.phone, '123456')).rejects.toThrow(
      messages.response.invalidCode
    );
  });

  it('should throw error if code is expired', async () => {
    const user = UserMockFactory.createEntity();
    const code = CodeMockFactory.createEntity({
      code: '123456',
      dateExp: new Date(Date.now() - 1 * 60 * 1000), // já expirado
    });

    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(code);

    await expect(useCase.execute(user.phone, '123456')).rejects.toThrow(
      messages.response.expiredCode
    );
  });

  it('should return token and user if code is valid and not expired', async () => {
    const user = UserMockFactory.createEntity();
    const code = CodeMockFactory.createEntity({
      code: '123456',
      dateExp: new Date(Date.now() + 10 * 60 * 1000), // ainda válido
    });

    const mockToken = 'mocked.token';

    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(code);
    TokenServiceMock.generateToken.mockReturnValue(mockToken);

    const result = await useCase.execute(user.phone, '123456');

    expect(result).toEqual({
      token: mockToken,
      user,
    });

    expect(CodeRepositoryMock.updateCode).toHaveBeenCalledWith(
      code.id,
      expect.objectContaining({
        attemptsCount: 0,
      })
    );
  });
});
