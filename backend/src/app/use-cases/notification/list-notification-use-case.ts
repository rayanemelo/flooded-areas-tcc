import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';

export class ListNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute() {
    const notifications = await this.notificationRepository.listNotifications();
    return notifications;
  }
}
