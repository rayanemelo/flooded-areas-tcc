import { Request, Response } from 'express';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';
import { UpdateUserUseCase } from '../../../app/use-cases/user/update-user-use-case';
import { z } from 'zod';

const bodySchema = z.object({
  phone: z.string().nonempty(),
  latitude: z.string().nonempty().optional(),
  longitude: z.string().nonempty().optional(),
})


class UpdateUserController {
  private updateUserUseCase: UpdateUserUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
  }

  handle = async (
    req: Request<{ id: number; phone: string; latitude?: string; longitude?: string }>,
    res: Response
  ) => {
    try {
      const { id } = paramIdSchema.parse(req.params);
      const body = bodySchema.parse(req.body);

      const user = await this.updateUserUseCase.execute(id, body);

      res.status(200).json(user);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const updateUserController = new UpdateUserController();
