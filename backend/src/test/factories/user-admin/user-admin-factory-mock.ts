import { faker } from '@faker-js/faker';
import { UserAdminEntity } from '../../../domain/entities/user-admin/user-admin-entity';

export class UserAdminMockFactory {
  public static createEntity(
    data: Partial<UserAdminEntity> = {}
  ): UserAdminEntity {
    return {
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
  }

  public static createEntities(amount = 10): UserAdminEntity[] {
    return Array.from({ length: amount }, this.createEntity);
  }
}
