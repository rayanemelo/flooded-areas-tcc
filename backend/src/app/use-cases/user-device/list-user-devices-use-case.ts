import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';

export class ListUserDevicesUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(userId: number) {
    const userDevices = await this.userDeviceRepository.listUserDevices(userId);

    return userDevices;
  }
}
