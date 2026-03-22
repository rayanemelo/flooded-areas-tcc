import { Request, Response } from 'express';

import {
  CreateUserAdminUseCase,
  UserAdminDTO,
} from '../../../app/use-cases/user-admin/create-user-admin-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { z } from 'zod';
import { UserAdminRepositoryPrisma } from '../../repositories/user-admin/user-admin-prisma';
import { HashServiceBcrypt } from '../../service/hash-service-bcrypt';

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

class CreateUserAdminController {
  private createUserAdminUseCase: CreateUserAdminUseCase;
  private hashService: HashServiceBcrypt;

  constructor() {
    const userAdminRepository = new UserAdminRepositoryPrisma();
    this.createUserAdminUseCase = new CreateUserAdminUseCase(
      userAdminRepository
    );
    this.hashService = new HashServiceBcrypt();
  }

  handle = async (req: Request<UserAdminDTO>, res: Response) => {
    try {
      const body = bodySchema.parse(req.body);

      const hashedPassword = await this.hashService.hash(body.password);
      const user = await this.createUserAdminUseCase.execute({
        ...body,
        password: hashedPassword,
      });

      res.status(201).json(user);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const createUserAdminController = new CreateUserAdminController();
