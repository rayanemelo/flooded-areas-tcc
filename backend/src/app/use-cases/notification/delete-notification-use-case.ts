import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class DeleteNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(id: number): Promise<void> {
    const notificationExists =
      await this.notificationRepository.getNotificationById(id);

    if (!notificationExists)
      throw new Exception(404, messages.response.notificationNotFound);

    await this.notificationRepository.deleteNotification(id);
  }
}
