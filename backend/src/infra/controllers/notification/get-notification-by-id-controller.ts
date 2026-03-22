import { Request, Response } from 'express';
import { GetNotificationByIdUseCase } from '../../../app/use-cases/notification/get-notification-by-id-use-case';
import { NotificationRepositoryPrisma } from '../../repositories/notification/notification-repository-prisma';

import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';

class GetNotificationByIdController {
  private getNotificationByIdUseCase: GetNotificationByIdUseCase;

  constructor() {
    const notificationRepository = new NotificationRepositoryPrisma();
    this.getNotificationByIdUseCase = new GetNotificationByIdUseCase(
      notificationRepository
    );
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const notification = await this.getNotificationByIdUseCase.execute(id);

      res.status(200).json(notification);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const getNotificationByIdController =
  new GetNotificationByIdController();
