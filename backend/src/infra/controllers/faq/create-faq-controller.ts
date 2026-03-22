import { Request, Response } from 'express';
import { CreateFaqUseCase } from '../../../app/use-cases/faq/create-faq-use-case';
import { FaqRepositoryPrisma } from '../../repositories/faq/faq-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { z } from 'zod';

const bodySchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Pergunta é obrigatória')
    .max(500, 'Pergunta deve ter no máximo 500 caracteres'),
  answer: z
    .string()
    .trim()
    .min(1, 'Resposta é obrigatória')
    .max(1000, 'Resposta deve ter no máximo 1000 caracteres'),
});


class CreateFaqController {
  private createFaqUseCase: CreateFaqUseCase;

  constructor() {
    const faqRepository = new FaqRepositoryPrisma();
    this.createFaqUseCase = new CreateFaqUseCase(faqRepository);
  }

  handle = async (
    req: Request<{ question: string; answer: string }>,
    res: Response
  ) => {
    try {
      const body = bodySchema.parse(req.body);

      const faq = await this.createFaqUseCase.execute(body);

      res.status(201).json(faq);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const createFaqController = new CreateFaqController();
