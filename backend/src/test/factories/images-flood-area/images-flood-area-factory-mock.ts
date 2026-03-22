import { faker } from '@faker-js/faker';
import { ImagesFloodAreaEntity } from '../../../domain/entities/images-flood-area/images-flood-area-entity';

export class ImagesFloodAreaMockFactory {
  public static createEntity(
    data: Partial<ImagesFloodAreaEntity> = {}
  ): ImagesFloodAreaEntity {
    return {
      id: faker.number.int(),
      url: faker.image.url(),
      floodAreaId: faker.number.int(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...data,
    };
  }

  public static createEntities(amount = 10): ImagesFloodAreaEntity[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
