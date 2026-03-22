import { faker } from '@faker-js/faker';
import { UserEntity } from '../../../domain/entities/user/user-entity';

export class UserMockFactory {
  public static createEntity(data: Partial<UserEntity> = {}): UserEntity {
    return {
      id: faker.number.int(),
      phone: faker.phone.number().toString(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
  }

  public static createEntities(amount = 10): UserEntity[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
