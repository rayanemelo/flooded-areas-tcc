import { Request, Response } from 'express';
import { z } from 'zod';
import {
  SaveUserAlertPreferencesDTO,
  SaveUserAlertPreferencesUseCase,
} from '../../../app/use-cases/user-alert-preference/save-user-alert-preferences-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { UserAlertPreferenceRepositoryPrisma } from '../../repositories/user/user-alert-preference-repository-prisma';
import { UserDeviceRepositoryPrisma } from '../../repositories/user/user-device-repository-prisma';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';

const bodySchema = z.object({
  state: z.string().trim().min(1),
  cities: z.array(z.string().trim().min(1)).min(1),
  pushToken: z.string().trim().min(1),
});

class SaveUserAlertPreferencesController {
  private saveUserAlertPreferencesUseCase: SaveUserAlertPreferencesUseCase;

  constructor() {
    const userRepository = new UserRepositoryPrisma();
    const userAlertPreferenceRepository =
      new UserAlertPreferenceRepositoryPrisma();
    const userDeviceRepository = new UserDeviceRepositoryPrisma();

    this.saveUserAlertPreferencesUseCase = new SaveUserAlertPreferencesUseCase(
      userRepository,
      userAlertPreferenceRepository,
      userDeviceRepository
    );
  }

  handle = async (
    req: Request<unknown, unknown, SaveUserAlertPreferencesDTO>,
    res: Response
  ) => {
    try {
      const body = bodySchema.parse(req.body);
      const userId = req.userId;

      const result = await this.saveUserAlertPreferencesUseCase.execute(
        userId,
        body
      );

      return res.status(201).json(result);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const saveUserAlertPreferencesController =
  new SaveUserAlertPreferencesController();
