import { Request, Response } from 'express';
import { FloodAreaRepositoryPrisma } from '../../repositories/flood-area/flood-area-repository-prisma';
import { GetFloodAreaByIdUseCase } from '../../../app/use-cases/flood-area/get-flood-area-by-id-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';
import { paramIdSchema } from '../../schemas/param-id-schema';
import { ImageFloodAreaRepositoryPrisma } from '../../repositories/images-flood-area/images-flood-area-prisma';

class GetFloodAreaByIdController {
  private getFloodAreaByIdUseCase: GetFloodAreaByIdUseCase;
  constructor() {
    const floodAreaRepository = new FloodAreaRepositoryPrisma();
    const imageFloodAreaRepository = new ImageFloodAreaRepositoryPrisma();
    this.getFloodAreaByIdUseCase = new GetFloodAreaByIdUseCase(
      floodAreaRepository,
      imageFloodAreaRepository
    );
  }

  handle = async (
    req: Request<unknown, unknown, { id: number }>,
    res: Response
  ) => {
    try {
      const { id } = paramIdSchema.parse(req.params);

      const floodAreas = await this.getFloodAreaByIdUseCase.execute(id);

      res.status(200).json(floodAreas);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const getFloodAreaByIdController = new GetFloodAreaByIdController();
