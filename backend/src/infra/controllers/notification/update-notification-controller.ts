import { Request, Response } from 'express';
import { UpdateNotificationUseCase } from '../../../app/use-cases/notification/update-notification-use-case';

import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';
import { NotificationRepositoryPrisma } from '../../repositories/notification/notification-repository-prisma';
import { NotificationDTO } from '../../../app/use-cases/notification/create-notification-use-case';
import { z } from 'zod';

const bodySchema = z.object({
  content: z.string().nonempty(),
});

class UpdateNotificationController {
  private updateNotificationUseCase: UpdateNotificationUseCase;

  constructor() {
    const notificationRepository = new NotificationRepositoryPrisma();
    this.updateNotificationUseCase = new UpdateNotificationUseCase(
      notificationRepository
    );
  }

  handle = async (
    req: Request<{ id: number; body: NotificationDTO }>,
    res: Response
  ) => {
    try {
      const { id } = paramIdSchema.parse(req.params);
      const body = bodySchema.parse(req.body);

      const notification = await this.updateNotificationUseCase.execute(
        id,
        body
      );

      res.status(200).json(notification);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const updateNotificationController = new UpdateNotificationController();
