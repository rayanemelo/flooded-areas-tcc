import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

export function formatDate(date: string) {
  const d = formatDistanceToNow(date || new Date(), {
    locale: ptBR,
    addSuffix: true,
  });
  return d;
}
