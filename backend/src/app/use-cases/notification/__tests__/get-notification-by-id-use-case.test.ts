import { faker } from '@faker-js/faker';

import { Exception } from '../../../../infra/exception/exception';
import { GetNotificationByIdUseCase } from '../get-notification-by-id-use-case';
import { NotificationRepositoryMock } from '../../../../test/repositories/notification/notification-repository-mock';
import { NotificationMockFactory } from '../../../../test/factories/notification/notification-factory-mock';

describe('Get Notification by ID Use Case', () => {
  let useCase: GetNotificationByIdUseCase;

  beforeEach(() => {
    useCase = new GetNotificationByIdUseCase(NotificationRepositoryMock);
    jest.clearAllMocks();
  });

  it('should get Notification by ID successfully', async () => {
    // Arrange
    const mockNotification = NotificationMockFactory.createEntity();

    NotificationRepositoryMock.getNotificationById.mockResolvedValueOnce(
      mockNotification
    );

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(NotificationRepositoryMock.getNotificationById).toHaveBeenCalledWith(
      1
    );
    expect(result).toEqual(mockNotification);
  });

  it('should throw a not found exception when Notification does not exists', async () => {
    // Arrange
    const id = faker.number.int();

    NotificationRepositoryMock.getNotificationById.mockResolvedValueOnce(null);

    // Act
    await expect(useCase.execute(id)).rejects.toThrow(Exception);

    // Assert
    expect(
      NotificationRepositoryMock.getNotificationById
    ).toHaveBeenCalledTimes(1);
    expect(NotificationRepositoryMock.getNotificationById).toHaveBeenCalledWith(
      id
    );
  });
});
