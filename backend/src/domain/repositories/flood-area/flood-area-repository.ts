import { FloodAreaEntity } from '../../entities/flood-area/flood-area-entity';

export type ListFloodAreaParams = {
  active?: 'active' | 'inactive' | 'all';
  status?: 'completed' | 'pending' | 'rejected';
  userId?: number;
};

export interface IFloodAreaRepository {
  listFloodAreas(param?: ListFloodAreaParams): Promise<FloodAreaEntity[]>;
  getFloodAreaById(id: number): Promise<FloodAreaEntity | null>;
  createFloodArea(floodArea: FloodAreaEntity): Promise<FloodAreaEntity>;
  updateFloodArea(
    id: number,
    floodArea: Partial<FloodAreaEntity>
  ): Promise<FloodAreaEntity>;
}
