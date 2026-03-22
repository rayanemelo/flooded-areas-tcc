import { faker } from '@faker-js/faker';
import { FaqEntity } from '../../../domain/entities/faq/faq-entity';

export class FaqMockFactory {
  public static createEntity(data: Partial<FaqEntity> = {}): FaqEntity {
    return {
      id: faker.number.int(),
      question: faker.lorem.sentence(),
      answer: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...data,
    };
  }

  public static createEntities(amount = 10): FaqEntity[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
