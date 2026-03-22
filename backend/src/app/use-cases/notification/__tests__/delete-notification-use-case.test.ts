import { faker } from '@faker-js/faker';

import { Exception } from '../../../../infra/exception/exception';
import { DeleteNotificationUseCase } from '../delete-notification-use-case';
import { NotificationRepositoryMock } from '../../../../test/repositories/notification/notification-repository-mock';
import { NotificationMockFactory } from '../../../../test/factories/notification/notification-factory-mock';

describe('Delete Notification Use Case', () => {
  let useCase: DeleteNotificationUseCase;

  beforeEach(() => {
    useCase = new DeleteNotificationUseCase(NotificationRepositoryMock);
    jest.clearAllMocks();
  });

  it('should delete Notification by ID successfully', async () => {
    // Arrange
    const id = faker.number.int();
    const mockNotification = NotificationMockFactory.createEntity();

    NotificationRepositoryMock.getNotificationById.mockResolvedValueOnce(
      mockNotification
    );

    // Act
    const result = await useCase.execute(id);

    // Assert
    expect(result).toBeUndefined();
    expect(
      NotificationRepositoryMock.getNotificationById
    ).toHaveBeenCalledTimes(1);
    expect(NotificationRepositoryMock.getNotificationById).toHaveBeenCalledWith(
      id
    );
    expect(NotificationRepositoryMock.deleteNotification).toHaveBeenCalledTimes(
      1
    );
    expect(NotificationRepositoryMock.deleteNotification).toHaveBeenCalledWith(
      id
    );
  });

  it('should throw a not found exception when Notification does not exists', async () => {
    // Arrange
    const id = faker.number.int();

    NotificationRepositoryMock.getNotificationById.mockResolvedValueOnce(null);

    // Act
    await expect(useCase.execute(id)).rejects.toThrow(Exception);
    expect(
      NotificationRepositoryMock.getNotificationById
    ).toHaveBeenCalledTimes(1);

    // Assert
    expect(
      NotificationRepositoryMock.getNotificationById
    ).toHaveBeenCalledTimes(1);
    expect(NotificationRepositoryMock.getNotificationById).toHaveBeenCalledWith(
      id
    );
    expect(
      NotificationRepositoryMock.deleteNotification
    ).not.toHaveBeenCalled();
  });
});
