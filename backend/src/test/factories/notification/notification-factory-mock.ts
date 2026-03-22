import { faker } from '@faker-js/faker';
import { NotificationEntity } from '../../../domain/entities/notification/notification-entity';

export class NotificationMockFactory {
  public static createEntity(
    data: Partial<NotificationEntity> = {}
  ): NotificationEntity {
    return {
      id: faker.number.int(),
      content: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...data,
    };
  }

  public static createEntities(amount = 10): NotificationEntity[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
