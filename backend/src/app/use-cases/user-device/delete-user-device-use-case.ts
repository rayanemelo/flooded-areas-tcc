import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class DeleteUserDeviceUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(id: number): Promise<void> {
    const userDeviceExists = await this.userDeviceRepository.getUserDeviceById(
      id
    );

    if (!userDeviceExists)
      throw new Exception(404, messages.response.userDeviceNotFound);

    await this.userDeviceRepository.deleteUserDevice(id);
  }
}
