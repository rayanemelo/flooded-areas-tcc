import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  FloodArea,
  FloodAreaService,
  UpdateFloodAreaByAdminPayload,
} from '@/services/flood-area';

const service = new FloodAreaService();

type UpdateFloodAreaInput = UpdateFloodAreaByAdminPayload & {
  id: number;
};

export function useFloodArea() {
  const queryClient = useQueryClient();

  const { data: floodAreaList, isLoading, error } = useQuery({
    queryKey: ['floodAreaList'],
    queryFn: () => service.getFloodAreaList(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: UpdateFloodAreaInput) =>
      service.updateFloodArea(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['floodAreaList'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ['floodAreaById', Number(variables.id)],
        });
      }
      toast.success('Relato de alagamento atualizado com sucesso.');
    },
    onError: () => {
      toast.error(
        'Não foi possível salvar as alterações do relato. Tente novamente mais tarde.'
      );
    },
  });

  const getFloodAreaById = async (id: number) => {
    return service.getFloodAreaById(id);
  };

  return {
    error,
    floodAreaList,
    isLoading,
    isUpdating: updateMutation.isPending,
    updateFloodArea: updateMutation.mutateAsync,
    getFloodAreaById,
  };
}
