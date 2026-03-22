import { FaqEntity } from '../../../domain/entities/faq/faq-entity';
import { IFaqRepository } from '../../../domain/repositories/faq/faq-repository';

export type FaqDTO = {
  question: string;
  answer: string;
};

export class CreateFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(body: FaqDTO): Promise<FaqEntity> {
    const faq = await this.faqRepository.createFaq(new FaqEntity(body));

    return faq;
  }
}
