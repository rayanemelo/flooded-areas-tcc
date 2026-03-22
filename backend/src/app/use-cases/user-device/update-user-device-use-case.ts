import { UserDeviceEntity } from '../../../domain/entities/user/user-device-entity';
import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export type UpdateUserDeviceDTO = Partial<
  Pick<UserDeviceEntity, 'userId' | 'pushToken'>
>;

export class UpdateUserDeviceUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(id: number, body: UpdateUserDeviceDTO): Promise<UserDeviceEntity> {
    const existingUserDevice =
      await this.userDeviceRepository.getUserDeviceById(id);

    if (!existingUserDevice)
      throw new Exception(404, messages.response.userDeviceNotFound);

    const updatedUserDevice = await this.userDeviceRepository.updateUserDevice(
      id,
      body
    );

    return updatedUserDevice;
  }
}
