import { UserEntity } from '../../entities/user/user-entity';

export interface IUserRepository {
  listUsers(): Promise<UserEntity[]>;
  getUserById(id: number): Promise<UserEntity | null>;
  getUserByPhone(phone: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUser(id: number, user: Partial<UserEntity>): Promise<UserEntity>;
  deleteUser(id: number): Promise<void>;
}
