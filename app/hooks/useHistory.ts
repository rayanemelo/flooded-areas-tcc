import { useQuery } from '@tanstack/react-query';
import { API } from '@/service/api';
import { Status } from '@/types/flood-area';

export interface IHistory {
  id: number;
  address: string;
  latitude: string;
  longitude: string;
  status: Status;
  created_at: string;
  floodLevelId: number;
  createdAt: string;
}

async function fetchUserHistory(): Promise<IHistory[]> {
  const response = await API.get('/user-history');
  return response.data;
}

export function useHistory() {
  const query = useQuery<IHistory[]>({
    queryKey: ['user-history'],
    queryFn: fetchUserHistory,
  });

  const sortedData =
    query.data?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) ?? [];

  return {
    history: sortedData,
    ...query,
  };
}
