import { UserAlertPreferenceEntity } from '../../../domain/entities/user/user-alert-preference-entity';
import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';

export type CreateUserAlertPreferenceDTO = {
  userId: number;
  state: string;
  city: string;
};

export class CreateUserAlertPreferenceUseCase {
  constructor(
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository
  ) {}

  async execute(
    body: CreateUserAlertPreferenceDTO
  ): Promise<UserAlertPreferenceEntity> {
    const userAlertPreference =
      await this.userAlertPreferenceRepository.createUserAlertPreference(
        new UserAlertPreferenceEntity(body)
      );

    return userAlertPreference;
  }
}
