import { Request, Response } from 'express';
import { FaqRepositoryPrisma } from '../../repositories/faq/faq-repository-prisma';
import { DeleteFaqUseCase } from '../../../app/use-cases/faq/delete-faq-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';

class DeleteFaqController {
  private deleteFaqUseCase: DeleteFaqUseCase;

  constructor() {
    const faqRepository = new FaqRepositoryPrisma();
    this.deleteFaqUseCase = new DeleteFaqUseCase(faqRepository);
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const faq = await this.deleteFaqUseCase.execute(id);

      res.status(200).json(faq);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const deleteFaqController = new DeleteFaqController();
