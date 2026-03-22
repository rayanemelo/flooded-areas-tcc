import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';

export class DeleteUserDevicesByUserIdUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(userId: number): Promise<void> {
    await this.userDeviceRepository.deleteUserDevicesByUserId(userId);
  }
}
