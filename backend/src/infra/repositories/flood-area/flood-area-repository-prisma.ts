import { FloodAreaEntity } from '../../../domain/entities/flood-area/flood-area-entity';
import {
  IFloodAreaRepository,
  ListFloodAreaParams,
} from '../../../domain/repositories/flood-area/flood-area-repository';
import { prisma } from '../../database';

export class FloodAreaRepositoryPrisma implements IFloodAreaRepository {
  async listFloodAreas(
    param?: ListFloodAreaParams
  ): Promise<FloodAreaEntity[]> {
    return await prisma.floodArea.findMany({
      where: {
        active:
          param?.active === 'active'
            ? true
            : param?.active === 'inactive'
              ? false
              : undefined,
        status: param?.status,
        userId: param?.userId ? Number(param.userId) : undefined,
      },
    });
  }

  async getFloodAreaById(id: number): Promise<FloodAreaEntity | null> {
    return await prisma.floodArea.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async createFloodArea(floodArea: FloodAreaEntity): Promise<FloodAreaEntity> {
    return await prisma.floodArea.create({
      data: floodArea,
    });
  }

  async updateFloodArea(
    id: number,
    floodArea: Partial<FloodAreaEntity>
  ): Promise<FloodAreaEntity> {
    return await prisma.floodArea.update({
      where: {
        id: Number(id),
      },
      data: floodArea,
    });
  }
}
