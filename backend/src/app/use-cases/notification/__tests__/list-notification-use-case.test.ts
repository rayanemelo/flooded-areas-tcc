import { NotificationMockFactory } from '../../../../test/factories/notification/notification-factory-mock';
import { NotificationRepositoryMock } from '../../../../test/repositories/notification/notification-repository-mock';
import { ListNotificationUseCase } from '../list-notification-use-case';

describe('List Notifications Use Case', () => {
  let useCase: ListNotificationUseCase;

  beforeEach(() => {
    useCase = new ListNotificationUseCase(NotificationRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list all Notifications', async () => {
    // Arrange
    const mockNotifications = NotificationMockFactory.createEntities(5);
    NotificationRepositoryMock.listNotifications.mockResolvedValueOnce(
      mockNotifications
    );

    // Act
    const result = await useCase.execute();

    // Assert
    expect(NotificationRepositoryMock.listNotifications).toHaveBeenCalledTimes(
      1
    );
    expect(result).toEqual(mockNotifications);
  });
});
