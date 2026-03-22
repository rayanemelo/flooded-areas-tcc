import { faker } from '@faker-js/faker';
import { FloodAreaEntity } from '../../../domain/entities/flood-area/flood-area-entity';

export class FloodAreaMockFactory {
  public static createEntity(
    data: Partial<FloodAreaEntity> = {}
  ): FloodAreaEntity {
    return {
      id: faker.number.int(),
      address: faker.location.streetAddress(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      status: 'pending',
      userId: faker.number.int(),
      floodLevelId: faker.number.int(),
      commentsAdmin: null,
      yesCount: 0,
      noCount: 0,
      active: true,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...data,
    };
  }

  public static createEntities(amount = 10): FloodAreaEntity[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
