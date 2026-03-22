import { UserDeviceEntity } from '../../../domain/entities/user/user-device-entity';
import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';

export type CreateUserDeviceDTO = {
  userId: number;
  pushToken: string;
};

export class CreateUserDeviceUseCase {
  constructor(private userDeviceRepository: IUserDeviceRepository) {}

  async execute(body: CreateUserDeviceDTO): Promise<UserDeviceEntity> {
    const userDevice = await this.userDeviceRepository.createUserDevice(
      new UserDeviceEntity(body)
    );

    return userDevice;
  }
}
