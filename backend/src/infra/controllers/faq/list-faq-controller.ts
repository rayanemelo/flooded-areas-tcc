import { NextFunction, Request, Response } from 'express';
import { ListFaqUseCase } from '../../../app/use-cases/faq/list-faq-use-case';
import { FaqRepositoryPrisma } from '../../repositories/faq/faq-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';

class ListFaqController {
  private listFaqUseCase: ListFaqUseCase;

  constructor() {
    const faqRepository = new FaqRepositoryPrisma();
    this.listFaqUseCase = new ListFaqUseCase(faqRepository);
  }

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const faqs = await this.listFaqUseCase.execute();
      res.status(200).json(faqs);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listFaqController = new ListFaqController();
