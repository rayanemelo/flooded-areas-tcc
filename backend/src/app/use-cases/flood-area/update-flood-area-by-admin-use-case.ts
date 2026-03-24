import { IFloodAreaRepository } from '../../../domain/repositories/flood-area/flood-area-repository';
import { NotificationEntity } from '../../../domain/entities/notification/notification-entity';
import { INotificationRepository } from '../../../domain/repositories/notification/notification-repository';
import { IUserAlertPreferenceRepository } from '../../../domain/repositories/user/user-alert-preference-repository';
import { IUserDeviceRepository } from '../../../domain/repositories/user/user-device-repository';
import { IPushNotificationService } from '../../../domain/services/push-notification-service';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export type UpdateFloodAreaByAdminDTO = {
  active: boolean;
  status: string;
  commentsAdmin?: string | null;
};

export class UpdateFloodAreaByAdminUseCase {
  constructor(
    private floodAreaRepository: IFloodAreaRepository,
    private notificationRepository: INotificationRepository,
    private userAlertPreferenceRepository: IUserAlertPreferenceRepository,
    private userDeviceRepository: IUserDeviceRepository,
    private pushNotificationService: IPushNotificationService
  ) { }

  async execute(id: number, body: UpdateFloodAreaByAdminDTO) {
    const floodAreaExists = await this.floodAreaRepository.getFloodAreaById(id);

    if (!floodAreaExists)
      throw new Exception(404, messages.response.floodAreaNotFound);

    const floodArea = await this.floodAreaRepository.updateFloodArea(id, body);

    const isCompletedNow =
      body.status.trim().toLowerCase() === 'completed' &&
      floodAreaExists.status.trim().toLowerCase() !== 'completed';

    if (isCompletedNow) {
      const preferences =
        await this.userAlertPreferenceRepository.listUserAlertPreferencesByLocation(
          floodAreaExists.state.trim(),
          floodAreaExists.city.trim()
        );

      const userIds = [...new Set(preferences.map((preference) => preference.userId))];
      const notificationContent = `Uma área alagada foi confirmada em ${floodAreaExists.city}.`;

      if (userIds.length > 0) {
        const devices =
          await this.userDeviceRepository.listUserDevicesByUserIds(userIds);
        const pushTokens = [
          ...new Set(devices.map((device) => device.pushToken.trim()).filter(Boolean)),
        ];

        if (pushTokens.length > 0) {
          await this.pushNotificationService.send(
            pushTokens.map((pushToken) => ({
              to: pushToken,
              title: 'Novo alerta confirmado',
              body: notificationContent,
              data: {
                floodAreaId: floodArea.id,
                city: floodAreaExists.city,
                state: floodAreaExists.state,
                status: body.status,
              },
            }))
          );
        }

        await Promise.all(
          userIds.map((userId) =>
            this.notificationRepository.createNotification(
              new NotificationEntity({
                userId,
                content: notificationContent,
              })
            )
          )
        );
      }
    }

    return floodArea;
  }
}
