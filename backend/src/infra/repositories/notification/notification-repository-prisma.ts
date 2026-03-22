import { NotificationEntity } from '../../../domain/entities/notification/notification-entity';
import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';
import { prisma } from '../../database';

export class NotificationRepositoryPrisma implements INotificationRepository {
  async listNotifications(): Promise<NotificationEntity[]> {
    return await prisma.notification.findMany();
  }

  async getNotificationById(id: number): Promise<NotificationEntity | null> {
    return await prisma.notification.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async createNotification(
    notification: NotificationEntity
  ): Promise<NotificationEntity> {
    return await prisma.notification.create({
      data: notification,
    });
  }

  async updateNotification(
    id: number,
    notification: Partial<NotificationEntity>
  ): Promise<NotificationEntity> {
    return await prisma.notification.update({
      where: {
        id: Number(id),
      },
      data: notification,
    });
  }

  async deleteNotification(id: number): Promise<void> {
    await prisma.notification.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
