import { Request, Response } from 'express';

import { FloodAreaRepositoryPrisma } from '../../repositories/flood-area/flood-area-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { z } from 'zod';
import {
  UpdateFloodAreaByAdminDTO,
  UpdateFloodAreaByAdminUseCase,
} from '../../../app/use-cases/flood-area/update-flood-area-by-admin-use-case';
import { UserAlertPreferenceRepositoryPrisma } from '../../repositories/user/user-alert-preference-repository-prisma';
import { UserDeviceRepositoryPrisma } from '../../repositories/user/user-device-repository-prisma';
import { ExpoPushNotificationService } from '../../service/push-notification-expo';

const bodySchema = z.object({
  active: z.boolean(),
  status: z.string(),
  commentsAdmin: z.string().nullish(),
});

class UpdateFloodAreaByAdminController {
  private updateFloodAreaByAdminUseCase: UpdateFloodAreaByAdminUseCase;

  constructor() {
    const floodAreaRepository = new FloodAreaRepositoryPrisma();
    const userAlertPreferenceRepository =
      new UserAlertPreferenceRepositoryPrisma();
    const userDeviceRepository = new UserDeviceRepositoryPrisma();
    const pushNotificationService = new ExpoPushNotificationService();
    this.updateFloodAreaByAdminUseCase = new UpdateFloodAreaByAdminUseCase(
      floodAreaRepository,
      userAlertPreferenceRepository,
      userDeviceRepository,
      pushNotificationService
    );
  }

  handle = async (
    req: Request<{ id: number; body: UpdateFloodAreaByAdminDTO }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const body = bodySchema.parse(req.body);

      const floodArea = await this.updateFloodAreaByAdminUseCase.execute(
        Number(id),
        body
      );

      res.status(200).json(floodArea);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const updateFloodAreaByAdminController =
  new UpdateFloodAreaByAdminController();
