import { API } from './api';


export type Faq = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export class FaqService {
  public async getFaqList(): Promise<Faq[]> {
    try {
      const { data } = await API.get<Faq[]>('/faq');
      return data;
    } catch (error) {
      console.log('Error fetching FAQ list:', error);
      return []
    }
  }

  public async createFaq(faq: Partial<Faq>): Promise<Faq> {
    try {
      const { data } = await API.post<Faq>('/faq', faq);
      return data;
    } catch (error) {
      console.log('Error creating FAQ:', error);
      return Promise.reject(error);
    }
  }

  public async updateFaq(id: string, faq: Partial<Faq>): Promise<Faq> {
    console.log("faq: ", faq);
    try {
      const { data } = await API.put<Faq>(`/faq/${id}`, faq);
      return data;
    } catch (error) {
      console.log('Error fetching FAQ list:', error);
      return Promise.reject(error);
    }
  }

  public async deleteFaq(id: string): Promise<void> {
    try {
      await API.delete(`/faq/${id}`);
    } catch (error) {
      console.log('Error deleting FAQ:', error);
      return Promise.reject(error);
    }
  }
}
