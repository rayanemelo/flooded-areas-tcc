import { useQuery } from '@tanstack/react-query';
import { FlooadAreaService } from '@/service/flood-area';
import { FloodArea } from '@/types/flood-area';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const floodAreaService = new FlooadAreaService();

export function useFloodedAreas() {
  const { authentication } = useAuth();

  const publicQuery = useQuery({
    queryKey: ['public-flood-areas'],
    queryFn: () => floodAreaService.getActiveFloodArea(),
  });

  const userQuery = useQuery({
    queryKey: ['user-flood-areas'],
    queryFn: () => floodAreaService.getPendingFloodAreaByUserId(),
    enabled: authentication.authenticated,
  });

  useFocusEffect(
    useCallback(() => {
      publicQuery.refetch();
      if (authentication.authenticated) {
        userQuery.refetch();
      }
    }, [authentication.authenticated, publicQuery, userQuery])
  );

  const floodedAreas: FloodArea[] = [
    ...(publicQuery.data || []),
    ...(authentication.authenticated ? userQuery.data || [] : []),
  ];

  return {
    floodedAreas,
    publicFloodedAreas: publicQuery.data || [],
    isLoading: publicQuery.isLoading || userQuery.isLoading,
    error: publicQuery.error || userQuery.error,
  };
}
