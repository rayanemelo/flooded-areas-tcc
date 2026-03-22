import { NotificationEntity } from '../../entities/notification/notification-entity';

export interface INotificationRepository {
  listNotifications(): Promise<NotificationEntity[]>;
  getNotificationById(id: number): Promise<NotificationEntity | null>;
  createNotification(
    notification: NotificationEntity
  ): Promise<NotificationEntity>;
  updateNotification(
    id: number,
    notification: Partial<NotificationEntity>
  ): Promise<NotificationEntity>;
  deleteNotification(id: number): Promise<void>;
}
