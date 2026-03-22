import { Request, Response } from 'express';
import { FaqRepositoryPrisma } from '../../repositories/faq/faq-repository-prisma';
import { UpdateFaqUseCase } from '../../../app/use-cases/faq/update-faq-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';

class UpdateFaqController {
  private updateFaqUseCase: UpdateFaqUseCase;

  constructor() {
    const faqRepository = new FaqRepositoryPrisma();
    this.updateFaqUseCase = new UpdateFaqUseCase(faqRepository);
  }

  handle = async (req: Request<{ id: number }>, res: Response) => {
    try {
      const { id } = paramIdSchema.parse(req.params);
      const faq = await this.updateFaqUseCase.execute(id, req.body);

      res.status(200).json(faq);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const updateFaqController = new UpdateFaqController();
