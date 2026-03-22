import { Request, Response } from 'express';
import { ListFloodAreaUseCase } from '../../../app/use-cases/flood-area/list-flood-area-use-case';
import { FloodAreaRepositoryPrisma } from '../../repositories/flood-area/flood-area-repository-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';

class ListFloodAreaController {
  private listFloodAreaUseCase: ListFloodAreaUseCase;

  constructor() {
    const floodAreaRepository = new FloodAreaRepositoryPrisma();
    this.listFloodAreaUseCase = new ListFloodAreaUseCase(floodAreaRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const floodAreas = await this.listFloodAreaUseCase.execute();
      res.status(200).json(floodAreas);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listFloodAreaController = new ListFloodAreaController();
