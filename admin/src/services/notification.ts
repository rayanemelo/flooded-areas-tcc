import { API } from './api';


export type Notification = {
  id: string;
  content: string;
  createdAt: string;
};

export class NotificationService {
  public async getNotificationList(): Promise<Notification[]> {
    try {
      const { data } = await API.get<Notification[]>('/notification');
      return data;
    } catch (error) {
      console.log('Error fetching Notification list:', error);
      return []
    }
  }

  public async createNotification(Notification: Partial<Notification>): Promise<Notification> {
    try {
      const { data } = await API.post<Notification>('/notification', Notification);
      return data;
    } catch (error) {
      console.log('Error creating Notification:', error);
      return Promise.reject(error);
    }
  }

  public async updateNotification(id: string, Notification: Partial<Notification>): Promise<Notification> {
    console.log("Notification: ", Notification);
    try {
      const { data } = await API.put<Notification>(`/notification/${id}`, Notification);
      return data;
    } catch (error) {
      console.log('Error fetching Notification list:', error);
      return Promise.reject(error);
    }
  }

  public async deleteNotification(id: string): Promise<void> {
    try {
      await API.delete(`/notification/${id}`);
    } catch (error) {
      console.log('Error deleting Notification:', error);
      return Promise.reject(error);
    }
  }
}
