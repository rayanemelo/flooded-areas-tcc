import { NextFunction, Request, Response } from 'express';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';
import { ListUserUseCase } from '../../../app/use-cases/user/list-users-use-case';

class ListUserController {
  private listUserUseCase: ListUserUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    this.listUserUseCase = new ListUserUseCase(userRepository);
  }

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.listUserUseCase.execute();
      res.status(200).json(users);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listUserController = new ListUserController();
