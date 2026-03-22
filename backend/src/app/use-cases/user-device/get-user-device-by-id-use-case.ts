import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class GetUserDeviceByIdUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(id: number) {
    const userDevice = await this.userDeviceRepository.getUserDeviceById(id);

    if (!userDevice)
      throw new Exception(404, messages.response.userDeviceNotFound);

    return userDevice;
  }
}
