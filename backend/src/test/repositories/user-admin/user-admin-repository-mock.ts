import { UserAdminEntity } from '../../../domain/entities/user-admin/user-admin-entity';
import { IUserAdminRepository } from '../../../domain/repositories/user-admin/user-admin-repository';

export const UserAdminRepositoryMock: jest.Mocked<IUserAdminRepository> = {
  findByEmail: jest.fn<Promise<UserAdminEntity | null>, [string]>(),
  createUserAdmin: jest.fn<Promise<UserAdminEntity>, [UserAdminEntity]>(),
};
