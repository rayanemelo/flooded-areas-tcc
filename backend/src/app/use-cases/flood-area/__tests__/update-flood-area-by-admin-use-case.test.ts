import { faker } from '@faker-js/faker';
import { FloodAreaRepositoryMock } from '../../../../test/repositories/flood-area/flood-area-repository-mock';
import { FloodAreaMockFactory } from '../../../../test/factories/flood-area/flood-area-factory-mock';
import { Exception } from '../../../../infra/exception/exception';
import { messages } from '../../../../infra/config/messages';
import { UpdateFloodAreaByAdminUseCase } from '../update-flood-area-by-admin-use-case';
import { UserAlertPreferenceRepositoryMock } from '../../../../test/repositories/user/user-alert-preference-repository-mock';
import { UserDeviceRepositoryMock } from '../../../../test/repositories/user/user-device-repository-mock';
import { PushNotificationServiceMock } from '../../../../test/repositories/push-notification/push-notification-service-mock';

describe('Update Flood Area By Admin Use Case', () => {
  let useCase: UpdateFloodAreaByAdminUseCase;

  beforeEach(() => {
    useCase = new UpdateFloodAreaByAdminUseCase(
      FloodAreaRepositoryMock,
      UserAlertPreferenceRepositoryMock,
      UserDeviceRepositoryMock,
      PushNotificationServiceMock
    );
    jest.clearAllMocks();
  });

  it('should update flood area by admin successfully', async () => {
    const mockFloodArea = FloodAreaMockFactory.createEntity();
    const userId = faker.number.int();

    const updateData = {
      active: true,
      status: 'completed',
      commentsAdmin: mockFloodArea.commentsAdmin ?? undefined,
    };

    FloodAreaRepositoryMock.getFloodAreaById = jest
      .fn()
      .mockResolvedValue(mockFloodArea);

    FloodAreaRepositoryMock.updateFloodArea = jest
      .fn()
      .mockResolvedValue({ ...mockFloodArea, ...updateData });
    UserAlertPreferenceRepositoryMock.listUserAlertPreferencesByLocation =
      jest.fn().mockResolvedValue([
        { id: 1, userId: 10, state: mockFloodArea.state, city: mockFloodArea.city },
      ]);
    UserDeviceRepositoryMock.listUserDevicesByUserIds = jest.fn().mockResolvedValue([
      { id: 1, userId: 10, pushToken: 'ExponentPushToken[abc]' },
    ]);

    const result = await useCase.execute(userId, updateData);

    expect(FloodAreaRepositoryMock.getFloodAreaById).toHaveBeenCalledWith(
      userId
    );
    expect(FloodAreaRepositoryMock.updateFloodArea).toHaveBeenCalledWith(
      userId,
      updateData
    );
    expect(
      UserAlertPreferenceRepositoryMock.listUserAlertPreferencesByLocation
    ).toHaveBeenCalledWith(mockFloodArea.state, mockFloodArea.city);
    expect(UserDeviceRepositoryMock.listUserDevicesByUserIds).toHaveBeenCalledWith([
      10,
    ]);
    expect(PushNotificationServiceMock.send).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ...mockFloodArea, ...updateData });
  });

  it('should throw exception when flood area does not exist', async () => {
    const userId = faker.number.int();
    const updateData = {
      active: false,
      status: 'rejected',
      commentsAdmin: 'Área não válida',
    };

    FloodAreaRepositoryMock.getFloodAreaById = jest
      .fn()
      .mockResolvedValue(null);

    await expect(useCase.execute(userId, updateData)).rejects.toThrow(
      new Exception(404, messages.response.floodAreaNotFound)
    );

    expect(FloodAreaRepositoryMock.getFloodAreaById).toHaveBeenCalledWith(
      userId
    );
    expect(FloodAreaRepositoryMock.updateFloodArea).not.toHaveBeenCalled();
    expect(PushNotificationServiceMock.send).not.toHaveBeenCalled();
  });

  it('should update flood area by admin with null comments', async () => {
    const mockFloodArea = FloodAreaMockFactory.createEntity();
    const userId = faker.number.int();

    const updateData = {
      active: true,
      status: 'completed',
      commentsAdmin: null,
    };

    FloodAreaRepositoryMock.getFloodAreaById = jest
      .fn()
      .mockResolvedValue(mockFloodArea);

    FloodAreaRepositoryMock.updateFloodArea = jest
      .fn()
      .mockResolvedValue({ ...mockFloodArea, ...updateData });
    UserAlertPreferenceRepositoryMock.listUserAlertPreferencesByLocation =
      jest.fn().mockResolvedValue([]);

    const result = await useCase.execute(userId, updateData);

    expect(FloodAreaRepositoryMock.getFloodAreaById).toHaveBeenCalledWith(
      userId
    );
    expect(FloodAreaRepositoryMock.updateFloodArea).toHaveBeenCalledWith(
      userId,
      updateData
    );
    expect(PushNotificationServiceMock.send).not.toHaveBeenCalled();
    expect(result).toEqual({ ...mockFloodArea, ...updateData });
  });

  it('should not send push notification when status was already completed', async () => {
    const mockFloodArea = FloodAreaMockFactory.createEntity({
      status: 'completed',
    });
    const userId = faker.number.int();

    const updateData = {
      active: true,
      status: 'completed',
      commentsAdmin: null,
    };

    FloodAreaRepositoryMock.getFloodAreaById = jest
      .fn()
      .mockResolvedValue(mockFloodArea);

    FloodAreaRepositoryMock.updateFloodArea = jest
      .fn()
      .mockResolvedValue({ ...mockFloodArea, ...updateData });

    await useCase.execute(userId, updateData);

    expect(
      UserAlertPreferenceRepositoryMock.listUserAlertPreferencesByLocation
    ).not.toHaveBeenCalled();
    expect(PushNotificationServiceMock.send).not.toHaveBeenCalled();
  });
});
