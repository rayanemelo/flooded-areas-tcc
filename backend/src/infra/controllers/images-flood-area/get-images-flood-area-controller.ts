import { Request, Response } from 'express';
import { GetImagesFloodAreaUseCase } from '../../../app/use-cases/images-flood-area/get-images-flood-area-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { ImageFloodAreaRepositoryPrisma } from '../../repositories/images-flood-area/images-flood-area-prisma';

class GetImagesFloodAreaController {
  private getImagesFloodAreaUseCase: GetImagesFloodAreaUseCase;

  constructor() {
    const imageFloodAreaRepository = new ImageFloodAreaRepositoryPrisma();
    this.getImagesFloodAreaUseCase = new GetImagesFloodAreaUseCase(
      imageFloodAreaRepository
    );
  }

  handle = async (req: Request, res: Response) => {
    try {
      const { floodAreaId } = req.params;

      const imagesFloodArea = await this.getImagesFloodAreaUseCase.execute(
        Number(floodAreaId)
      );

      res.status(200).json(imagesFloodArea);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const getImagesFloodAreaController = new GetImagesFloodAreaController();
