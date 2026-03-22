import { NotificationMockFactory } from '../../../../test/factories/notification/notification-factory-mock';
import { NotificationRepositoryMock } from '../../../../test/repositories/notification/notification-repository-mock';
import { CreateNotificationUseCase } from '../create-notification-use-case';

describe('Create Notification Use Case', () => {
  let useCase: CreateNotificationUseCase;

  beforeEach(() => {
    useCase = new CreateNotificationUseCase(NotificationRepositoryMock);
    jest.clearAllMocks();
  });

  it('should create a new Notification', async () => {
    // Arrange
    const mockNotification = NotificationMockFactory.createEntity();
    NotificationRepositoryMock.createNotification.mockResolvedValueOnce(
      mockNotification
    );

    // Act
    const result = await useCase.execute(mockNotification);

    // Assert
    expect(NotificationRepositoryMock.createNotification).toHaveBeenCalledWith(
      mockNotification
    );
    expect(result).toEqual(mockNotification);
  });

  it('should throw an error if Notification creation fails', async () => {
    // Arrange
    const mockNotification = NotificationMockFactory.createEntity();
    const errorMessage = 'Error creating Notification';
    NotificationRepositoryMock.createNotification.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(useCase.execute(mockNotification)).rejects.toThrow(
      errorMessage
    );
  });
});
