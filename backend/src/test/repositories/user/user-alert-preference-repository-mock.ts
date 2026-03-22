import { UserAlertPreferenceEntity } from '../../../domain/entities/user/user-alert-preference-entity';
import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';

export const UserAlertPreferenceRepositoryMock: jest.Mocked<IUserAlertPreferenceRepository> =
  {
    listUserAlertPreferences: jest.fn<Promise<UserAlertPreferenceEntity[]>, [number]>(),
    listUserAlertPreferencesByLocation: jest.fn<
      Promise<UserAlertPreferenceEntity[]>,
      [string, string]
    >(),
    getUserAlertPreferenceById: jest.fn<
      Promise<UserAlertPreferenceEntity | null>,
      [number]
    >(),
    getUserAlertPreferenceByUserIdAndLocation: jest.fn<
      Promise<UserAlertPreferenceEntity | null>,
      [number, string, string]
    >(),
    createUserAlertPreference: jest.fn<
      Promise<UserAlertPreferenceEntity>,
      [UserAlertPreferenceEntity]
    >(),
    deleteUserAlertPreference: jest.fn<Promise<void>, [number]>(),
    deleteUserAlertPreferencesByUserId: jest.fn<Promise<void>, [number]>(),
  };
