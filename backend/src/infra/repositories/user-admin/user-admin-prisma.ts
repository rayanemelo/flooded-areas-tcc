import { UserAdminEntity } from '../../../domain/entities/user-admin/user-admin-entity';
import { IUserAdminRepository } from '../../../domain/repositories/user-admin/user-admin-repository';
import { prisma } from '../../database';

export class UserAdminRepositoryPrisma implements IUserAdminRepository {
  async createUserAdmin(user: UserAdminEntity): Promise<UserAdminEntity> {
    return await prisma.userAdmin.create({ data: user });
  }
  async findByEmail(email: string): Promise<UserAdminEntity | null> {
    return await prisma.userAdmin.findUnique({
      where: {
        email,
      },
    });
  }
}
