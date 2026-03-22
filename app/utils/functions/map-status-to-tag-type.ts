import { Status } from '@/types/flood-area';

export function mapStatusToTagType(status: Status) {
  return {
    pending: 4,
    completed: 5,
    rejected: 6,
  }[status];
}
