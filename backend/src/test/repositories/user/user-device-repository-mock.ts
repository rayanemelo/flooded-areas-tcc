import { UserDeviceEntity } from '../../../domain/entities/user/user-device-entity';
import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';

export const UserDeviceRepositoryMock: jest.Mocked<IUserDeviceRepository> = {
  listUserDevices: jest.fn<Promise<UserDeviceEntity[]>, [number]>(),
  listUserDevicesByUserIds: jest.fn<Promise<UserDeviceEntity[]>, [number[]]>(),
  getUserDeviceById: jest.fn<Promise<UserDeviceEntity | null>, [number]>(),
  getUserDeviceByPushToken: jest.fn<Promise<UserDeviceEntity | null>, [string]>(),
  createUserDevice: jest.fn<Promise<UserDeviceEntity>, [UserDeviceEntity]>(),
  updateUserDevice: jest.fn<
    Promise<UserDeviceEntity>,
    [number, Partial<UserDeviceEntity>]
  >(),
  deleteUserDevice: jest.fn<Promise<void>, [number]>(),
  deleteUserDevicesByUserId: jest.fn<Promise<void>, [number]>(),
};
