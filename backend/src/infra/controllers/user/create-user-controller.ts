import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../app/use-cases/user/create-user-use-case';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { z } from 'zod';

const bodySchema = z.object({
  phone: z.string().nonempty(),
  latitude: z.string().nonempty(),
  longitude: z.string().nonempty(),
});

class CreateUserController {
  private createUserUseCase: CreateUserUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    this.createUserUseCase = new CreateUserUseCase(userRepository);
  }

  handle = async (
    req: Request<{ phone: string; latitude: string; longitude: string }>,
    res: Response
  ) => {
    try {
      const body = bodySchema.parse(req.body);

      const user = await this.createUserUseCase.execute(body);

      res.status(201).json(user);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const createUserController = new CreateUserController();
