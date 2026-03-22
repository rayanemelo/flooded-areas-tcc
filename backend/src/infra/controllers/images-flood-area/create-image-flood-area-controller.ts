import { Request, Response } from 'express';
import { CreateImageFloodAreaUseCase } from '../../../app/use-cases/images-flood-area/create-image-flood-area-use-case';
import { z } from 'zod';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { ImageStorageCloudinary } from '../../storages/image-storage-cloudinary';
import { ImageFloodAreaRepositoryPrisma } from '../../repositories/images-flood-area/images-flood-area-prisma';

const bodySchema = z.object({
  floodAreaId: z.number(),
  image: z.string(),
});

class CreateImageFloodAreaController {
  private createImageFloodAreaUseCase: CreateImageFloodAreaUseCase;

  constructor() {
    const imageFloodAreaRepository = new ImageFloodAreaRepositoryPrisma();
    const imageStorageRepository = new ImageStorageCloudinary();
    this.createImageFloodAreaUseCase = new CreateImageFloodAreaUseCase(
      imageFloodAreaRepository,
      imageStorageRepository
    );
  }

  handle = async (
    req: Request<unknown, unknown, { floodAreaId: number; image: string }>,
    res: Response
  ) => {
    try {
      const { image, floodAreaId } = bodySchema.parse(req.body);

      const imageFloodArea = await this.createImageFloodAreaUseCase.execute(
        floodAreaId,
        image
      );

      res.status(201).json(imageFloodArea);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const createImageFloodAreaController =
  new CreateImageFloodAreaController();
