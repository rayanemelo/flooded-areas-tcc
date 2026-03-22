import { FaqEntity } from '../../../domain/entities/faq/faq-entity';
import { IFaqRepository } from '../../../domain/repositories/faq/faq-repository';

export const FaqRepositoryMock: jest.Mocked<IFaqRepository> = {
  listFaqs: jest.fn<Promise<FaqEntity[]>, []>(),
  getFaqById: jest.fn<Promise<FaqEntity>, [number]>(),
  createFaq: jest.fn<Promise<FaqEntity>, [FaqEntity]>(),
  updateFaq: jest.fn<Promise<FaqEntity>, [number, Partial<FaqEntity>]>(),
  deleteFaq: jest.fn<Promise<void>, [number]>(),
};
