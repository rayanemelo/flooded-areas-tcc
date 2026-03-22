import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';

export class ListUserAlertPreferencesUseCase {
  constructor(
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository
  ) {}

  async execute(userId: number) {
    const userAlertPreferences =
      await this.userAlertPreferenceRepository.listUserAlertPreferences(userId);

    return userAlertPreferences;
  }
}
