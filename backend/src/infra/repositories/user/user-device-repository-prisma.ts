import { UserDeviceEntity } from '../../../domain/entities/user/user-device-entity';
import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { prisma } from '../../database';

export class UserDeviceRepositoryPrisma implements IUserDeviceRepository {
  async listUserDevices(userId: number): Promise<UserDeviceEntity[]> {
    return await prisma.userDevice.findMany({
      where: {
        userId: Number(userId),
      },
    });
  }

  async getUserDeviceById(id: number): Promise<UserDeviceEntity | null> {
    return await prisma.userDevice.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async getUserDeviceByPushToken(
    pushToken: string
  ): Promise<UserDeviceEntity | null> {
    return await prisma.userDevice.findUnique({
      where: {
        pushToken,
      },
    });
  }

  async createUserDevice(userDevice: UserDeviceEntity): Promise<UserDeviceEntity> {
    return await prisma.userDevice.create({
      data: userDevice,
    });
  }

  async updateUserDevice(
    id: number,
    userDevice: Partial<UserDeviceEntity>
  ): Promise<UserDeviceEntity> {
    return await prisma.userDevice.update({
      where: {
        id: Number(id),
      },
      data: userDevice,
    });
  }

  async deleteUserDevice(id: number): Promise<void> {
    await prisma.userDevice.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async deleteUserDevicesByUserId(userId: number): Promise<void> {
    await prisma.userDevice.deleteMany({
      where: {
        userId: Number(userId),
      },
    });
  }
}
