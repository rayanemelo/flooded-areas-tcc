import { UserDeviceEntity } from '../../../domain/entities/user/user-device-entity';
import { UserAlertPreferenceEntity } from '../../../domain/entities/user/user-alert-preference-entity';
import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';
import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { IUserRepository } from '../../../domain/repositories/user/user-repository';
import { Exception } from '../../../infra/exception/exception';
import { CreateUserAlertPreferenceUseCase } from './create-user-alert-preference-use-case';
import { DeleteUserAlertPreferencesByUserIdUseCase } from './delete-user-alert-preferences-by-user-id-use-case';
import { CreateUserDeviceUseCase } from '../user-device/create-user-device-use-case';
import { GetUserDeviceByPushTokenUseCase } from '../user-device/get-user-device-by-push-token-use-case';
import { UpdateUserDeviceUseCase } from '../user-device/update-user-device-use-case';
import { GetUserByIdUseCase } from '../user/get-user-by-id-use-case';

export type SaveUserAlertPreferencesDTO = {
  state: string;
  cities: string[];
  pushToken: string;
};

type SaveUserAlertPreferencesResponse = {
  preferences: UserAlertPreferenceEntity[];
  device: UserDeviceEntity;
};

export class SaveUserAlertPreferencesUseCase {
  private getUserByIdUseCase: GetUserByIdUseCase;
  private createUserAlertPreferenceUseCase: CreateUserAlertPreferenceUseCase;
  private deleteUserAlertPreferencesByUserIdUseCase: DeleteUserAlertPreferencesByUserIdUseCase;
  private getUserDeviceByPushTokenUseCase: GetUserDeviceByPushTokenUseCase;
  private createUserDeviceUseCase: CreateUserDeviceUseCase;
  private updateUserDeviceUseCase: UpdateUserDeviceUseCase;

  constructor(
    userRepository: IUserRepository,
    userAlertPreferenceRepository: IUserAlertPreferenceRepository,
    userDeviceRepository: IUserDeviceRepository
  ) {
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.createUserAlertPreferenceUseCase = new CreateUserAlertPreferenceUseCase(
      userAlertPreferenceRepository
    );
    this.deleteUserAlertPreferencesByUserIdUseCase =
      new DeleteUserAlertPreferencesByUserIdUseCase(
        userAlertPreferenceRepository
      );
    this.getUserDeviceByPushTokenUseCase = new GetUserDeviceByPushTokenUseCase(
      userDeviceRepository
    );
    this.createUserDeviceUseCase = new CreateUserDeviceUseCase(
      userDeviceRepository
    );
    this.updateUserDeviceUseCase = new UpdateUserDeviceUseCase(
      userDeviceRepository
    );
  }

  async execute(
    userId: number,
    body: SaveUserAlertPreferencesDTO
  ): Promise<SaveUserAlertPreferencesResponse> {
    await this.getUserByIdUseCase.execute(userId);

    const normalizedCities = [
      ...new Set(body.cities.map((city) => city.trim()).filter(Boolean)),
    ];

    await this.deleteUserAlertPreferencesByUserIdUseCase.execute(userId);

    const preferences: UserAlertPreferenceEntity[] = [];

    for (const city of normalizedCities) {
      const preference = await this.createUserAlertPreferenceUseCase.execute({
        userId,
        state: body.state.trim(),
        city,
      });

      preferences.push(preference);
    }

    let device: UserDeviceEntity;

    try {
      const existingDevice =
        await this.getUserDeviceByPushTokenUseCase.execute(body.pushToken);

      device =
        existingDevice.userId === userId
          ? existingDevice
          : await this.updateUserDeviceUseCase.execute(existingDevice.id, {
              userId,
              pushToken: body.pushToken,
            });
    } catch (error) {
      if (error instanceof Exception && error.code === 404) {
        device = await this.createUserDeviceUseCase.execute({
          userId,
          pushToken: body.pushToken,
        });
      } else {
        throw error;
      }
    }

    return {
      preferences,
      device,
    };
  }
}
