import { NotificationEntity } from '../../../domain/entities/notification/notification-entity';
import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';

export type NotificationDTO = {
  content: string;
};

export class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(body: NotificationDTO): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.createNotification(
      new NotificationEntity(body)
    );
    return notification;
  }
}
