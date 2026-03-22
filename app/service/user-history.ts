import { FloodArea } from '@/types/flood-area';
import { API } from './api';

export class UserHistoryService {
  async getHistoryById(id: string): Promise<FloodArea | null> {
    try {
      const response = await API.get(`/flood-area/${id}`);

      return response.data;
    } catch {
      return null;
    }
  }
}
