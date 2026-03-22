import { UserEntity } from '../../../domain/entities/user/user-entity';
import { IUserRepository } from '../../../domain/repositories/user/user-repository';

export const UserRepositoryMock: jest.Mocked<IUserRepository> = {
  listUsers: jest.fn<Promise<UserEntity[]>, []>(),
  getUserById: jest.fn<Promise<UserEntity>, [number]>(),
  getUserByPhone: jest.fn<Promise<UserEntity>, [string]>(),
  createUser: jest.fn<Promise<UserEntity>, [UserEntity]>(),
  updateUser: jest.fn<Promise<UserEntity>, [number, Partial<UserEntity>]>(),
  deleteUser: jest.fn<Promise<void>, [number]>(),
};
