import { UserAlertPreferenceEntity } from '../../../domain/entities/user/user-alert-preference-entity';
import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';
import { prisma } from '../../database';

export class UserAlertPreferenceRepositoryPrisma
  implements IUserAlertPreferenceRepository
{
  async listUserAlertPreferences(
    userId: number
  ): Promise<UserAlertPreferenceEntity[]> {
    return await prisma.userAlertPreference.findMany({
      where: {
        userId: Number(userId),
      },
    });
  }

  async getUserAlertPreferenceById(
    id: number
  ): Promise<UserAlertPreferenceEntity | null> {
    return await prisma.userAlertPreference.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async getUserAlertPreferenceByUserIdAndLocation(
    userId: number,
    state: string,
    city: string
  ): Promise<UserAlertPreferenceEntity | null> {
    return await prisma.userAlertPreference.findFirst({
      where: {
        userId: Number(userId),
        state,
        city,
      },
    });
  }

  async createUserAlertPreference(
    userAlertPreference: UserAlertPreferenceEntity
  ): Promise<UserAlertPreferenceEntity> {
    return await prisma.userAlertPreference.create({
      data: userAlertPreference,
    });
  }

  async deleteUserAlertPreference(id: number): Promise<void> {
    await prisma.userAlertPreference.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async deleteUserAlertPreferencesByUserId(userId: number): Promise<void> {
    await prisma.userAlertPreference.deleteMany({
      where: {
        userId: Number(userId),
      },
    });
  }
}
