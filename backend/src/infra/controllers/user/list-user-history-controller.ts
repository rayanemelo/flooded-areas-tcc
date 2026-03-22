import { Request, Response } from 'express';
import { ListUserHistoryUseCase } from '../../../app/use-cases/user/list-user-history-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { UserHistoryRepositoryPrisma } from '../../repositories/user-history/user-history-prisma';

class ListUserHistoryController {
  private listUserHistoryUseCase: ListUserHistoryUseCase;

  constructor() {
    const userHistoryRepository = new UserHistoryRepositoryPrisma();
    this.listUserHistoryUseCase = new ListUserHistoryUseCase(
      userHistoryRepository
    );
  }

  handle = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      const userHistories = await this.listUserHistoryUseCase.execute(userId);

      res.status(200).json(userHistories);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listUserHistoryController = new ListUserHistoryController();
