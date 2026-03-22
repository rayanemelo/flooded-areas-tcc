import { UserEntity } from '../../../domain/entities/user/user-entity';
import { IUserRepository } from '../../../domain/repositories/user/user-repository';
import { prisma } from '../../database';

export class UserRepositoryPrisma implements IUserRepository {
  async listUsers(): Promise<UserEntity[]> {
    return await prisma.user.findMany();
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getUserByPhone(phone: string): Promise<UserEntity | null> {
    return await prisma.user.findUnique({ where: { phone } });
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    return await prisma.user.create({ data: user });
  }

  async updateUser(id: number, user: Partial<UserEntity>): Promise<UserEntity> {
    return await prisma.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
