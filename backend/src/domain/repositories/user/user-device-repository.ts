import { UserDeviceEntity } from '../../entities/user/user-device-entity';

export interface IUserDeviceRepository {
  listUserDevices(userId: number): Promise<UserDeviceEntity[]>;
  listUserDevicesByUserIds(userIds: number[]): Promise<UserDeviceEntity[]>;
  getUserDeviceById(id: number): Promise<UserDeviceEntity | null>;
  getUserDeviceByPushToken(pushToken: string): Promise<UserDeviceEntity | null>;
  createUserDevice(userDevice: UserDeviceEntity): Promise<UserDeviceEntity>;
  updateUserDevice(
    id: number,
    userDevice: Partial<UserDeviceEntity>
  ): Promise<UserDeviceEntity>;
  deleteUserDevice(id: number): Promise<void>;
  deleteUserDevicesByUserId(userId: number): Promise<void>;
}
