import { NotificationMockFactory } from '../../../../test/factories/notification/notification-factory-mock';
import { NotificationRepositoryMock } from '../../../../test/repositories/notification/notification-repository-mock';
import { ListNotificationUseCase } from '../list-notification-use-case';

describe('List Notifications Use Case', () => {
  let useCase: ListNotificationUseCase;

  beforeEach(() => {
    useCase = new ListNotificationUseCase(NotificationRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list user Notifications', async () => {
    const mockNotifications = NotificationMockFactory.createEntities(5);
    const userId = 1;
    NotificationRepositoryMock.listNotifications.mockResolvedValueOnce(
      mockNotifications
    );

    const result = await useCase.execute(userId);

    expect(NotificationRepositoryMock.listNotifications).toHaveBeenCalledTimes(
      1
    );
    expect(NotificationRepositoryMock.listNotifications).toHaveBeenCalledWith(
      userId
    );
    expect(result).toEqual(mockNotifications);
  });
});
