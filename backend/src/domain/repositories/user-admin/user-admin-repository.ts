import { UserAdminEntity } from '../../entities/user-admin/user-admin-entity';

export interface IUserAdminRepository {
  // listUsersAdmin(): Promise<UserAdminEntity[]>;
  findByEmail(email: string): Promise<UserAdminEntity | null>;
  createUserAdmin(user: UserAdminEntity): Promise<UserAdminEntity>;
  // updateUserAdmin(
  //   id: number,
  //   user: Partial<UserAdminEntity>
  // ): Promise<UserAdminEntity>;
  // deleteUserAdmin(id: number): Promise<void>;
}
