import { IFaqRepository } from '../../../domain/repositories/faq/faq-repository';

export class ListFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute() {
    const faqs = await this.faqRepository.listFaqs();
    return faqs;
  }
}
