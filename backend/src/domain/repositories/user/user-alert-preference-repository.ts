import { UserAlertPreferenceEntity } from '../../entities/user/user-alert-preference-entity';

export interface IUserAlertPreferenceRepository {
  listUserAlertPreferences(userId: number): Promise<UserAlertPreferenceEntity[]>;
  getUserAlertPreferenceById(
    id: number
  ): Promise<UserAlertPreferenceEntity | null>;
  getUserAlertPreferenceByUserIdAndLocation(
    userId: number,
    state: string,
    city: string
  ): Promise<UserAlertPreferenceEntity | null>;
  createUserAlertPreference(
    userAlertPreference: UserAlertPreferenceEntity
  ): Promise<UserAlertPreferenceEntity>;
  deleteUserAlertPreference(id: number): Promise<void>;
  deleteUserAlertPreferencesByUserId(userId: number): Promise<void>;
}
