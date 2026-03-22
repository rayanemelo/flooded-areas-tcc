import { API } from './api';

export type FloodAreaStatus = 'pending' | 'completed' | 'rejected';

export type FloodAreaImage = {
  id: number;
  floodAreaId: number;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export type FloodArea = {
  id: number;
  address: string;
  latitude: string;
  longitude: string;
  active: boolean;
  status: FloodAreaStatus;
  userId: number;
  floodLevelId: number;
  commentsAdmin: string | null;
  yesCount: number;
  noCount: number;
  createdAt: string;
  updatedAt: string;
  images: FloodAreaImage[];
};

export type UpdateFloodAreaByAdminPayload = {
  active: boolean;
  status: FloodAreaStatus;
  commentsAdmin?: string | null;
};

export class FloodAreaService {
  public async getFloodAreaList(): Promise<FloodArea[]> {
    try {
      const { data } = await API.get<FloodArea[]>('/flood-area');
      return data;
    } catch (error) {
      console.log('Error fetching flood area list:', error);
      return [];
    }
  }

  public async getFloodAreaById(id: number): Promise<FloodArea> {
    try {
      const { data } = await API.get<FloodArea>(`/flood-area/${id}`);
      return data;
    } catch (error) {
      console.log('Error fetching flood area by id:', error);
      return Promise.reject(error);
    }
  }

  public async updateFloodArea(
    id: number,
    floodArea: UpdateFloodAreaByAdminPayload
  ): Promise<FloodArea> {
    try {
      const { data } = await API.patch<FloodArea>(`/flood-area/${id}`, floodArea);
      return data;
    } catch (error) {
      console.log('Error updating flood area:', error);
      return Promise.reject(error);
    }
  }
}
