import { NotificationEntity } from '../../../domain/entities/notification/notification-entity';
import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';
import { prisma } from '../../database';

export class NotificationRepositoryPrisma implements INotificationRepository {
  async listNotifications(userId: number): Promise<NotificationEntity[]> {
    return await prisma.$queryRaw<NotificationEntity[]>`
      SELECT
        id,
        user_id AS "userId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM tb_notification
      WHERE user_id = ${Number(userId)}
      ORDER BY created_at DESC
    `;
  }

  async getNotificationById(id: number): Promise<NotificationEntity | null> {
    const [notification] = await prisma.$queryRaw<NotificationEntity[]>`
      SELECT
        id,
        user_id AS "userId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM tb_notification
      WHERE id = ${Number(id)}
      LIMIT 1
    `;

    return notification ?? null;
  }

  async createNotification(
    notification: NotificationEntity
  ): Promise<NotificationEntity> {
    const [createdNotification] = await prisma.$queryRaw<NotificationEntity[]>`
      INSERT INTO tb_notification (user_id, content, created_at, updated_at)
      VALUES (
        ${notification.userId},
        ${notification.content},
        ${notification.createdAt},
        ${notification.updatedAt}
      )
      RETURNING
        id,
        user_id AS "userId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    return createdNotification;
  }

  async updateNotification(
    id: number,
    notification: Partial<NotificationEntity>
  ): Promise<NotificationEntity> {
    const [updatedNotification] = await prisma.$queryRaw<NotificationEntity[]>`
      UPDATE tb_notification
      SET
        user_id = COALESCE(${notification.userId}, user_id),
        content = COALESCE(${notification.content}, content),
        updated_at = NOW()
      WHERE id = ${Number(id)}
      RETURNING
        id,
        user_id AS "userId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<void> {
    await prisma.$executeRaw`
      DELETE FROM tb_notification
      WHERE id = ${Number(id)}
    `;
  }
}
