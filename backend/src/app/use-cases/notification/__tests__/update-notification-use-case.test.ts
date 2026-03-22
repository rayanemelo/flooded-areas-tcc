import { faker } from '@faker-js/faker';
import { Exception } from '../../../../infra/exception/exception';
import { UpdateNotificationUseCase } from '../update-notification-use-case';
import { NotificationRepositoryMock } from '../../../../test/repositories/notification/notification-repository-mock';
import { NotificationMockFactory } from '../../../../test/factories/notification/notification-factory-mock';

describe('Update Notification Use Case', () => {
  let useCase: UpdateNotificationUseCase;

  beforeEach(() => {
    useCase = new UpdateNotificationUseCase(NotificationRepositoryMock);
    jest.clearAllMocks();
  });

  it('should update an existing Notification', async () => {
    // Arrange
    const mockNotification = NotificationMockFactory.createEntity();

    NotificationRepositoryMock.getNotificationById.mockResolvedValueOnce(
      mockNotification
    );
    NotificationRepositoryMock.updateNotification.mockResolvedValueOnce(
      mockNotification
    );

    // Act
    const result = await useCase.execute(mockNotification.id, {
      content: mockNotification.content,
    });

    // Assert
    expect(NotificationRepositoryMock.getNotificationById).toHaveBeenCalledWith(
      mockNotification.id
    );
    expect(NotificationRepositoryMock.updateNotification).toHaveBeenCalledWith(
      mockNotification.id,
      expect.objectContaining({
        content: mockNotification.content,
      })
    );
    expect(result).toEqual(mockNotification);
  });

  it('should throw an error if Notification doesnt exist', async () => {
    // Arrange
    const id = faker.number.int();
    const mockNotification = NotificationMockFactory.createEntity();

    NotificationRepositoryMock.getNotificationById.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(useCase.execute(id, mockNotification)).rejects.toThrow(
      Exception
    );

    expect(NotificationRepositoryMock.getNotificationById).toHaveBeenCalledWith(
      id
    );
    expect(
      NotificationRepositoryMock.updateNotification
    ).not.toHaveBeenCalled();
  });
});
