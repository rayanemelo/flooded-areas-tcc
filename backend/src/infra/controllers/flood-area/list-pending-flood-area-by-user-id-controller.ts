import { Request, Response } from 'express';
import { FloodAreaRepositoryPrisma } from '../../repositories/flood-area/flood-area-repository-prisma';
import { ImageFloodAreaRepositoryPrisma } from '../../repositories/images-flood-area/images-flood-area-prisma';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { ListPendingFloodAreaByUserIdUseCase } from '../../../app/use-cases/flood-area/list-pending-flood-area-by-user-id-use-case';

export class ListPendingFloodAreaByUserIdController {
  private listPendingFloodAreaByUserUseCase: ListPendingFloodAreaByUserIdUseCase;

  constructor() {
    const floodAreaRepository = new FloodAreaRepositoryPrisma();
    const imageFloodAreaRepository = new ImageFloodAreaRepositoryPrisma();
    this.listPendingFloodAreaByUserUseCase =
      new ListPendingFloodAreaByUserIdUseCase(
        floodAreaRepository,
        imageFloodAreaRepository
      );
  }

  handle = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      const listPendingFloodAreas =
        await this.listPendingFloodAreaByUserUseCase.execute(userId);
      res.status(200).json(listPendingFloodAreas);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listPendingFloodAreaByUserIdController =
  new ListPendingFloodAreaByUserIdController();
