import { FloodAreaStatus } from "@/services/flood-area";

export function mapFloodLevel(floodLevelId: number) {
  switch (floodLevelId) {
    case 1:
      return 'Leve';
    case 2:
      return 'Moderado';
    case 3:
      return 'Interditado';
    default:
      return 'Leve';
  }
}

export function mapStatus(status: FloodAreaStatus) {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'rejected':
      return 'Rejeitado';
    case 'pending':
    default:
      return 'Pendente';
  }
}
