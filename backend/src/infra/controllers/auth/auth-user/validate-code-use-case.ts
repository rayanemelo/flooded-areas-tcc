import { Request, Response } from 'express';
import { ValidateCodeUseCase } from '../../../../app/use-cases/auth/auth-user/validate-code-use-case';
import { CodeRepositoryPrisma } from '../../../repositories/code/code-repository-prisma';
import { UserRepositoryPrisma } from '../../../repositories/user/user-repository-prisma';
import { TokenServiceJWT } from '../../../service/token-service-jwt';
import { GlobalExceptionHandler } from '../../../exception/global-exception-handler';
import { messages } from '../../../config/messages';
import { z } from 'zod';

const bodySchema = z.object({
  phone: z
    .string()
    .min(10, { message: messages.validations.phoneMinLength })
    .max(15, { message: messages.validations.phoneMaxLength })
    .regex(/^\d+$/, {
      message: messages.validations.phoneDigits,
    }),
  code: z.string(),
});

class ValidateCodeController {
  private validateCodeUseCase: ValidateCodeUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    const codeRepository = new CodeRepositoryPrisma();
    const tokenService = new TokenServiceJWT();
    this.validateCodeUseCase = new ValidateCodeUseCase(
      userRepository,
      codeRepository,
      tokenService
    );
  }

  handle = async (
    request: Request<{ phone: string; code: string }>,
    response: Response
  ) => {
    try {
      const { phone, code } = bodySchema.parse(request.body);

      const res = await this.validateCodeUseCase.execute(phone, code);

      return response.status(200).json(res);
    } catch (error) {
      GlobalExceptionHandler.handle(error, response);
    }
  };
}

export const validateCodeController = new ValidateCodeController();
