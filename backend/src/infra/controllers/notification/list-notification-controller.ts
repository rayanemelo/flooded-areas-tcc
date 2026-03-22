import { Request, Response } from 'express';
import { ListNotificationUseCase } from '../../../app/use-cases/notification/list-notification-use-case';
import { NotificationRepositoryPrisma } from '../../repositories/notification/notification-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';

class ListNotificationController {
  private listNotificationUseCase: ListNotificationUseCase;

  constructor() {
    const notificationRepository = new NotificationRepositoryPrisma();
    this.listNotificationUseCase = new ListNotificationUseCase(
      notificationRepository
    );
  }

  handle = async (req: Request, res: Response) => {
    try {
      const notifications = await this.listNotificationUseCase.execute();
      res.status(200).json(notifications);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listNotificationController = new ListNotificationController();
