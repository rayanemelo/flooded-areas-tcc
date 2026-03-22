import { UserHistoryEntities } from '../../../domain/entities/user-history/user-history-entities';
import { IUserHistoryRepository } from '../../../domain/repositories/user-history/user-history-repository';

export const UserHistoryRepositoryMock: jest.Mocked<IUserHistoryRepository> = {
  listUserHistory: jest.fn<Promise<UserHistoryEntities[]>, [number]>(),
};
