import { IFaqRepository } from '../../../domain/repositories/faq/faq-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class DeleteFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(id: number): Promise<void> {
    const faqExists = await this.faqRepository.getFaqById(id);

    if (!faqExists) throw new Exception(404, messages.response.faqNotFound);

    await this.faqRepository.deleteFaq(id);
  }
}
