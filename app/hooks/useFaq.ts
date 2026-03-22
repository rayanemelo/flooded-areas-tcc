import { API } from '@/service/api';
import { useEffect, useState } from 'react';

export interface IFAQ {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<IFAQ[] | []>([]);

  const fetchFaqs = async () => {
    try {
      const response = await API.get('/faq');
      setFaqs(response.data);
    } catch {
      setFaqs([]);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return {
    faqs,
  };
}
