import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class GetNotificationByIdUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(id: number) {
    const notification =
      await this.notificationRepository.getNotificationById(id);

    if (!notification)
      throw new Exception(404, messages.response.notificationNotFound);

    return notification;
  }
}
