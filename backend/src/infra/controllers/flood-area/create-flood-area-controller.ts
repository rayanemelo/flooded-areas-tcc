import { Request, Response } from 'express';
import {
  CreateFloodAreaUseCase,
  FloodAreaDTO,
} from '../../../app/use-cases/flood-area/create-flood-area-use-case';
import { z } from 'zod';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { FloodAreaRepositoryPrisma } from '../../repositories/flood-area/flood-area-repository-prisma';
import { ImageStorageCloudinary } from '../../storages/image-storage-cloudinary';
import { ImageFloodAreaRepositoryPrisma } from '../../repositories/images-flood-area/images-flood-area-prisma';
import { FloodAreaAiAnalysisHttpRepository } from '../../repositories/flood-area-ai-analysis/flood-area-ai-analysis-http-repository';
import { UserRepositoryPrisma } from '../../repositories/user/user-repository-prisma';

const bodySchema = z.object({
  address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  city: z.string(),
  state: z.string(),
  status: z.string(),
  floodLevelId: z.number(),
  image: z.string(),
  userLocation: z.object({
    latitude: z.string(),
    longitude: z.string(),
  }),
});

class CreateFloodAreaController {
  private createFloodAreaUseCase: CreateFloodAreaUseCase;

  constructor() {
    const floodAreaRepository = new FloodAreaRepositoryPrisma();
    const imageFloodAreaRepository = new ImageFloodAreaRepositoryPrisma();
    const imageStorageRepository = new ImageStorageCloudinary();
    const floodAreaAiAnalysisRepository =
      new FloodAreaAiAnalysisHttpRepository();
    const userRepository = new UserRepositoryPrisma();
    this.createFloodAreaUseCase = new CreateFloodAreaUseCase(
      floodAreaRepository,
      imageFloodAreaRepository,
      imageStorageRepository,
      floodAreaAiAnalysisRepository,
      userRepository
    );
  }

  handle = async (
    req: Request<unknown, unknown, FloodAreaDTO>,
    res: Response
  ) => {
    try {
      const body = bodySchema.parse(req.body);
      const userId = req.userId;
      console.log('userId: ', userId);

      const floodArea = await this.createFloodAreaUseCase.execute(userId, body);

      res.status(201).json(floodArea);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const createFloodAreaController = new CreateFloodAreaController();
