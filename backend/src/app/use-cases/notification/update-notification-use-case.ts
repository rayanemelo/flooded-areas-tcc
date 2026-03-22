import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';
import { NotificationDTO } from './create-notification-use-case';

export class UpdateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(id: number, body: NotificationDTO) {
    const notificationExists =
      await this.notificationRepository.getNotificationById(id);

    if (!notificationExists)
      throw new Exception(404, messages.response.notificationNotFound);

    const notification = await this.notificationRepository.updateNotification(
      id,
      body
    );

    return notification;
  }
}
