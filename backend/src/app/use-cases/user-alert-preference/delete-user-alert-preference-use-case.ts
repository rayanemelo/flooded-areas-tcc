import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class DeleteUserAlertPreferenceUseCase {
  constructor(
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository
  ) {}

  async execute(id: number): Promise<void> {
    const userAlertPreferenceExists =
      await this.userAlertPreferenceRepository.getUserAlertPreferenceById(id);

    if (!userAlertPreferenceExists)
      throw new Exception(
        404,
        messages.response.userAlertPreferenceNotFound
      );

    await this.userAlertPreferenceRepository.deleteUserAlertPreference(id);
  }
}
