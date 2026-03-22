import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';

export class ListNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: number) {
    const notifications = await this.notificationRepository.listNotifications(
      userId
    );
    return notifications;
  }
}
