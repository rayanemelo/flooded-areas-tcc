import { Request, Response } from 'express';
import { ListActiveFloodAreaUseCase } from '../../../app/use-cases/flood-area/list-active-flood-area-use-case';
import { FloodAreaRepositoryPrisma } from '../../repositories/flood-area/flood-area-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { ImageFloodAreaRepositoryPrisma } from '../../repositories/images-flood-area/images-flood-area-prisma';

class ListActiveFloodAreasController {
  private listActiveFloodAreaUseCase: ListActiveFloodAreaUseCase;

  constructor() {
    const floodAreaRepository = new FloodAreaRepositoryPrisma();
    const imageFloodAreaRepository = new ImageFloodAreaRepositoryPrisma();
    this.listActiveFloodAreaUseCase = new ListActiveFloodAreaUseCase(
      floodAreaRepository,
      imageFloodAreaRepository
    );
  }

  handle = async (req: Request, res: Response) => {
    try {
      const listActiveFloodAreas =
        await this.listActiveFloodAreaUseCase.execute();
      res.status(200).json(listActiveFloodAreas);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listActiveFloodAreasController =
  new ListActiveFloodAreasController();
