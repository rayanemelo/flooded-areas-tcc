import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';

export class DeleteUserAlertPreferencesByUserIdUseCase {
  constructor(
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository
  ) {}

  async execute(userId: number): Promise<void> {
    await this.userAlertPreferenceRepository.deleteUserAlertPreferencesByUserId(
      userId
    );
  }
}
