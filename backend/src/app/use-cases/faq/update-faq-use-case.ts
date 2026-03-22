import { FaqEntity } from '../../../domain/entities/faq/faq-entity';
import { IFaqRepository } from '../../../domain/repositories/faq/faq-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';
import { FaqDTO } from './create-faq-use-case';

export class UpdateFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(id: number, body: FaqDTO): Promise<FaqEntity> {
    const faqExists = await this.faqRepository.getFaqById(id);

    if (!faqExists) throw new Exception(404, messages.response.faqNotFound);

    const faq = await this.faqRepository.updateFaq(id, new FaqEntity(body));

    return faq;
  }
}
