import { UserHistoryEntities } from '../../../domain/entities/user-history/user-history-entities';
import { IUserHistoryRepository } from '../../../domain/repositories/user-history/user-history-repository';
import { prisma } from '../../database';

export class UserHistoryRepositoryPrisma implements IUserHistoryRepository {
  async listUserHistory(userId: number): Promise<UserHistoryEntities[]> {
    const floodAreas = await prisma.floodArea.findMany({
      where: {
        userId: userId,
      },
    });

    return floodAreas;
  }
}
