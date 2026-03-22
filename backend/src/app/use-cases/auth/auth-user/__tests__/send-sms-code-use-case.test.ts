import { faker } from '@faker-js/faker';
import { CodeRepositoryMock } from '../../../../../test/repositories/code/code-repository-mock';
import { SmsServiceMock } from '../../../../../test/repositories/sms-service/sms-service-repository-mock';
import { UserRepositoryMock } from '../../../../../test/repositories/user/user-repository-mock';
import { SendSmsCodeUseCase } from '../send-sms-code-use-case';
import { UserMockFactory } from '../../../../../test/factories/user/user-factory-mock';
import { CodeMockFactory } from '../../../../../test/factories/code/code-factory-mock';
import { messages } from '../../../../../infra/config/messages';

describe('Send Sms Code Use Case', () => {
  let useCase: SendSmsCodeUseCase;

  beforeEach(() => {
    useCase = new SendSmsCodeUseCase(
      UserRepositoryMock,
      CodeRepositoryMock,
      SmsServiceMock
    );
    jest.clearAllMocks();
  });

  it('should create user and code if user does not exist', async () => {
    const phone = faker.phone.number();
    const user = UserMockFactory.createEntity();
    const code = CodeMockFactory.createEntity();

    UserRepositoryMock.getUserByPhone.mockResolvedValue(null);
    UserRepositoryMock.createUser.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(null);
    CodeRepositoryMock.createCode.mockResolvedValue(code);

    await useCase.execute({ phone });

    expect(UserRepositoryMock.createUser).toHaveBeenCalled();
    expect(CodeRepositoryMock.createCode).toHaveBeenCalled();
    expect(SmsServiceMock.send).toHaveBeenCalledWith(
      phone,
      expect.stringContaining('')
    );
  });

  it('should update code if it exists and limit not exceeded', async () => {
    const phone = faker.phone.number();
    const user = UserMockFactory.createEntity();
    const code = CodeMockFactory.createEntity();
    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(code);
    CodeRepositoryMock.updateCode.mockResolvedValue({
      ...code,
      attemptsCount: 5,
    });

    await useCase.execute({ phone });

    expect(CodeRepositoryMock.updateCode).toHaveBeenCalled();
    expect(SmsServiceMock.send).toHaveBeenCalled();
  });

  it('should use user location when creating user', async () => {
    const phone = faker.phone.number();
    const code = CodeMockFactory.createEntity();
    const user = UserMockFactory.createEntity();
    const userLocation = {
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
    };

    UserRepositoryMock.getUserByPhone.mockResolvedValue(null);
    UserRepositoryMock.createUser.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(null);
    CodeRepositoryMock.createCode.mockResolvedValue(code);

    await useCase.execute({ phone, userLocation });

    expect(UserRepositoryMock.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        phone,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      })
    );
  });

  it('should update user location when user exists and location is provided', async () => {
    const phone = faker.phone.number();
    const user = UserMockFactory.createEntity();
    const code = CodeMockFactory.createEntity();
    const userLocation = {
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
    };

    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    UserRepositoryMock.updateUser.mockResolvedValue({
      ...user,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(null);
    CodeRepositoryMock.createCode.mockResolvedValue(code);

    await useCase.execute({ phone, userLocation });

    expect(UserRepositoryMock.updateUser).toHaveBeenCalledWith(user.id, {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
  });

  it('should throw error if attempts exceed limit and under 10 minutes', async () => {
    const phone = faker.phone.number();
    const user = UserMockFactory.createEntity();

    const recentDate = new Date(Date.now() - 5 * 60 * 1000); // 5 minutos atrás
    const code = {
      ...CodeMockFactory.createEntity(),
      updatedAt: recentDate,
      attemptsCount: 5,
    };

    UserRepositoryMock.getUserByPhone.mockResolvedValue(user);
    CodeRepositoryMock.getCodeByUserId.mockResolvedValue(code);

    await expect(useCase.execute({ phone })).rejects.toThrow(
      messages.response.limitExceeded
    );

    expect(CodeRepositoryMock.updateCode).not.toHaveBeenCalled();
    expect(SmsServiceMock.send).not.toHaveBeenCalled();
  });
});
