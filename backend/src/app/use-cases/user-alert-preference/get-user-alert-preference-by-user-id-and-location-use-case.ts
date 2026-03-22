import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export type GetUserAlertPreferenceByUserIdAndLocationDTO = {
  userId: number;
  state: string;
  city: string;
};

export class GetUserAlertPreferenceByUserIdAndLocationUseCase {
  constructor(
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository
  ) {}

  async execute(body: GetUserAlertPreferenceByUserIdAndLocationDTO) {
    const { userId, state, city } = body;

    const userAlertPreference =
      await this.userAlertPreferenceRepository.getUserAlertPreferenceByUserIdAndLocation(
        userId,
        state,
        city
      );

    if (!userAlertPreference)
      throw new Exception(
        404,
        messages.response.userAlertPreferenceNotFound
      );

    return userAlertPreference;
  }
}
