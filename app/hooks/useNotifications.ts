import { useQuery } from '@tanstack/react-query';
import { API } from '@/service/api';
import { useAuth } from '@/context/AuthContext';

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
  const { authentication } = useAuth();

  const query = useQuery<INotification[]>({
    queryKey: ['notification'],
    queryFn: fetchUserHistory,
    enabled: authentication.authenticated,
  });

  const sortedData =
    query.data?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) ?? [];

  return {
    notifications: authentication.authenticated ? sortedData : [],
    ...query,
  };
}
