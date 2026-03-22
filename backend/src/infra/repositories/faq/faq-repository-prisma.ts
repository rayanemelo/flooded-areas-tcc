import { FaqEntity } from '../../../domain/entities/faq/faq-entity';
import { IFaqRepository } from '../../../domain/repositories/faq/faq-repository';
import { prisma } from '../../database';

export class FaqRepositoryPrisma implements IFaqRepository {
  async listFaqs(): Promise<FaqEntity[]> {
    return await prisma.faq.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getFaqById(id: number): Promise<FaqEntity | null> {
    return await prisma.faq.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async createFaq(faq: FaqEntity): Promise<FaqEntity> {
    return await prisma.faq.create({
      data: faq,
    });
  }

  async updateFaq(id: number, faq: Partial<FaqEntity>): Promise<FaqEntity> {
    return await prisma.faq.update({
      where: {
        id: Number(id),
      },
      data: faq,
    });
  }

  async deleteFaq(id: number): Promise<void> {
    await prisma.faq.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
