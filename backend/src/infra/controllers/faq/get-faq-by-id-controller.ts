import { Request, Response } from 'express';
import { FaqRepositoryPrisma } from '../../repositories/faq/faq-repository-prisma';
import { GetFaqByIdUseCase } from '../../../app/use-cases/faq/get-faq-by-id-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';

class GetFaqByIdController {
  private getFaqByIdUseCase: GetFaqByIdUseCase;

  constructor() {
    const faqRepository = new FaqRepositoryPrisma();
    this.getFaqByIdUseCase = new GetFaqByIdUseCase(faqRepository);
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const faq = await this.getFaqByIdUseCase.execute(id);

      res.status(200).json(faq);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const getFaqByIdController = new GetFaqByIdController();
