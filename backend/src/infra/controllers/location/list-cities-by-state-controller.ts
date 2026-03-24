import { Request, Response } from 'express';
import { z } from 'zod';
import { ListCitiesByStateUseCase } from '../../../app/use-cases/location/list-cities-by-state-use-case';
import { GlobalExceptionHandler } from '../../exception/global-exception-handler';

const querySchema = z.object({
  state: z.string().trim().min(2).max(2),
});

class ListCitiesByStateController {
  private listCitiesByStateUseCase: ListCitiesByStateUseCase;

  constructor() {
    this.listCitiesByStateUseCase = new ListCitiesByStateUseCase();
  }

  handle = async (req: Request, res: Response) => {
    try {
      const { state } = querySchema.parse(req.query);
      const result = await this.listCitiesByStateUseCase.execute(state);

      return res.status(200).json(result);
    } catch (error) {
      GlobalExceptionHandler.handle(error, res);
    }
  };
}

export const listCitiesByStateController = new ListCitiesByStateController();
