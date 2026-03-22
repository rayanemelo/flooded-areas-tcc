import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class GetUserDeviceByPushTokenUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(pushToken: string) {
    const userDevice =
      await this.userDeviceRepository.getUserDeviceByPushToken(pushToken);

    if (!userDevice)
      throw new Exception(404, messages.response.userDeviceNotFound);

    return userDevice;
  }
}
