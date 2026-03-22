import { NotificationEntity } from '../../../domain/entities/notification/notification-entity';
import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';

export const NotificationRepositoryMock: jest.Mocked<INotificationRepository> =
  {
    listNotifications: jest.fn<Promise<NotificationEntity[]>, []>(),
    getNotificationById: jest.fn<Promise<NotificationEntity>, [number]>(),
    createNotification: jest.fn<
      Promise<NotificationEntity>,
      [NotificationEntity]
    >(),
    updateNotification: jest.fn<
      Promise<NotificationEntity>,
      [number, Partial<NotificationEntity>]
    >(),
    deleteNotification: jest.fn<Promise<void>, [number]>(),
  };
