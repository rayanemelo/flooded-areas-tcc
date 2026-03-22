import {
  FloodArea,
  FloodAreaForm,
  FloodAreaImage,
  FloodAreaUpdate,
} from '@/types/flood-area';
import { API } from './api';

export class FlooadAreaService {
  public async getActiveFloodArea(): Promise<FloodArea[]> {
    try {
      const res = await API.get('/flood-area/active');
      return res.data;
    } catch (error) {
      return [];
    }
  }

  public async sendFloodArea(payload: FloodAreaForm) {
    try {
      return await API.post('/flood-area', payload);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getImagesByFloodAreaId(
    id: string
  ): Promise<FloodAreaImage[] | null> {
    try {
      const res = await API.get(`/flood-area/${id}/images`);
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getPendingFloodAreaByUserId(): Promise<FloodArea[]> {
    try {
      const res = await API.get(`/flood-area/user/pending`);
      return res.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async updateFloodAreaAlert(
    payload: FloodAreaUpdate
  ): Promise<AxiosResponse<FloodArea | null>> {
    try {
      return await API.patch('/flood-area/user/alert-response', payload);
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        data: null,
      };
    }
  }
}
