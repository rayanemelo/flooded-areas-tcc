import { Request, Response } from 'express';
import {
  SendSmsCodeDTO,
  SendSmsCodeUseCase,
} from '../../../../app/use-cases/auth/auth-user/send-sms-code-use-case';
import { GlobalExceptionHandler } from '../../../exception/global-exception-handler';
import { CodeRepositoryPrisma } from '../../../repositories/code/code-repository-prisma';
import { UserRepositoryPrisma } from '../../../repositories/user/user-repository-prisma';
import { SmsServiceTwilio } from '../../../service/sms-service-twilio';
import { z } from 'zod';
import { messages } from '../../../config/messages';

const bodySchema = z.object({
  phone: z
    .string()
    .min(10, { message: messages.validations.phoneMinLength })
    .max(15, { message: messages.validations.phoneMaxLength })
    .regex(/^\d+$/, {
      message: messages.validations.phoneDigits,
    }),
  userLocation: z
    .object({
      latitude: z.string(),
      longitude: z.string(),
    })
    .nullable()
    .optional(),
});

class SendSmsCodeController {
  private sendSmsCodeUseCase: SendSmsCodeUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    const codeRepository = new CodeRepositoryPrisma();
    const smsService = new SmsServiceTwilio();
    this.sendSmsCodeUseCase = new SendSmsCodeUseCase(
      userRepository,
      codeRepository,
      smsService
    );
  }

  handle = async (req: Request<unknown, unknown, SendSmsCodeDTO>, res: Response) => {
    try {
      const body = bodySchema.parse(req.body);

      await this.sendSmsCodeUseCase.execute(body);

      return res.status(204).send();
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const sendSmsCodeController = new SendSmsCodeController();
