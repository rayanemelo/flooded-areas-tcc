import { Request, Response } from 'express';
import { paramIdSchema } from '../../schemas/param-id-schema';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';
import { DeleteUserUseCase } from '../../../app/use-cases/user/delete-user-use-case';

export class DeleteUserController {
  private deleteUserUseCase: DeleteUserUseCase;
  constructor() {
    const userRepository = new UserRepositoryPrisma();
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const user = await this.deleteUserUseCase.execute(id);

      res.status(200).json(user);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}
