import { UserHistoryEntities } from '../../../domain/entities/user-history/user-history-entities';
import { IUserHistoryRepository } from '../../../domain/repositories/user-history/user-history-repository';

export class ListUserHistoryUseCase {
  constructor(private userHistoryRepository: IUserHistoryRepository) {}

  async execute(userId: number): Promise<UserHistoryEntities[]> {
    const userHistory =
      await this.userHistoryRepository.listUserHistory(userId);
    return userHistory;
  }
}
