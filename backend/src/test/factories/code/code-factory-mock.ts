import { faker } from '@faker-js/faker';
import { CodeEntity } from '../../../domain/entities/code/code-entity';

export class CodeMockFactory {
  public static createEntity(data: Partial<CodeEntity> = {}): CodeEntity {
    return {
      id: faker.number.int(),
      code: faker.string.alphanumeric(6),
      dateExp: new Date(Date.now() + 10 * 60 * 1000),
      attemptsCount: 0,
      userId: faker.number.int(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...data,
    };
  }
}
