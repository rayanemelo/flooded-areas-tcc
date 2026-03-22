import { Request, Response } from 'express';
import { DeleteNotificationUseCase } from '../../../app/use-cases/notification/delete-notification-use-case';
import { NotificationRepositoryPrisma } from '../../repositories/notification/notification-repository-prisma';
import { paramIdSchema } from '../../schemas/param-id-schema';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';

class DeleteNotificationController {
  private deleteNotificationUseCase: DeleteNotificationUseCase;

  constructor() {
    const notificationRepository = new NotificationRepositoryPrisma();
    this.deleteNotificationUseCase = new DeleteNotificationUseCase(
      notificationRepository
    );
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const faq = await this.deleteNotificationUseCase.execute(id);

      res.status(200).json(faq);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const deleteNotificationController = new DeleteNotificationController();
