import { UserHistoryEntities } from '../../entities/user-history/user-history-entities';

export interface IUserHistoryRepository {
  listUserHistory(userId: number): Promise<UserHistoryEntities[]>;
}
