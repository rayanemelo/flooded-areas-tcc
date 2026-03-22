import { Request, Response } from 'express';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';
import { GetUserByIdUseCase } from '../../../app/use-cases/user/get-user-by-id-use-case';

class GetUserByIdController {
  private getUserByIdUseCase: GetUserByIdUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const user = await this.getUserByIdUseCase.execute(id);

      res.status(200).json(user);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const getUserByIdController = new GetUserByIdController();
