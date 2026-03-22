import { useQuery } from '@tanstack/react-query';
import { API } from '@/service/api';

export interface INotification {
  id: number;
  content: string;
  createdAt: string;
}

async function fetchUserHistory(): Promise<INotification[]> {
  const response = await API.get('/notification');
  return response.data;
}

export function useNotifications() {
  const query = useQuery<INotification[]>({
    queryKey: ['notification'],
    queryFn: fetchUserHistory,
  });

  const sortedData =
    query.data?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) ?? [];

  return {
    notifications: sortedData,
    ...query,
  };
}
