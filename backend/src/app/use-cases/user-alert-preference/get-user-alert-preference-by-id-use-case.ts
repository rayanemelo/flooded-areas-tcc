import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class GetUserAlertPreferenceByIdUseCase {
  constructor(
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository
  ) {}

  async execute(id: number) {
    const userAlertPreference =
      await this.userAlertPreferenceRepository.getUserAlertPreferenceById(id);

    if (!userAlertPreference)
      throw new Exception(
        404,
        messages.response.userAlertPreferenceNotFound
      );

    return userAlertPreference;
  }
}
