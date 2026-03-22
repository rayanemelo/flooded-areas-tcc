import { faker } from '@faker-js/faker';
import { UserHistoryEntities } from '../../../domain/entities/user-history/user-history-entities';

export class UserHistoryMockFactory {
  public static createEntity(
    data: Partial<UserHistoryEntities> = {}
  ): UserHistoryEntities {
    return {
      userId: faker.number.int(),
      address: faker.location.streetAddress(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      commentsAdmin: faker.helpers.arrayElement([faker.lorem.sentence(), null]),
      createdAt: new Date(),
      ...data,
    };
  }

  public static createEntities(amount = 10): UserHistoryEntities[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
