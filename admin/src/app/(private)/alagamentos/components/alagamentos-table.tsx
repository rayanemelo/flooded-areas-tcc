'use client';

import { useRouter } from 'next/navigation';
import { Eye, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BaseTable } from '@/components/base-table/base-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { nivelVariant, statusVariant } from '@/utils/styles';

type Item = {
  id: string;
  endereco: string;
  nivel: string;
  status: string;
  data: string;
  lat: number;
  lng: number;
};

type Props = {
  data: Item[];
};

export function AlagamentosTable({ data }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  function translateFloodLevel(level: string) {
    switch (level) {
      case 'Leve':
        return t('flood-level.light');
      case 'Moderado':
        return t('flood-level.moderate');
      case 'Interditado':
        return t('flood-level.interdicted');
      default:
        return level;
    }
  }

  function translateFloodStatus(status: string) {
    switch (status) {
      case 'Pendente':
        return t('flood-status.pending');
      case 'Concluído':
        return t('flood-status.completed');
      case 'Rejeitado':
        return t('flood-status.rejected');
      default:
        return status;
    }
  }

  return (
    <BaseTable<Item>
      list={data}
      isLoading={false}
      skeleton={null}
      emptyMessage={t('alagamentos.table.empty')}
      columns={[
        {
          header: t('table.address'),
          className: 'max-w-[500px] truncate',
          cell: (item) => (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => router.push(`/alagamentos/${item.id}`)}
                className="truncate text-left font-medium text-slate-900 hover:underline dark:text-slate-100"
              >
                {item.endereco}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('table.id-prefix')} {item.id}
              </span>
            </div>
          ),
        },
        {
          header: t('table.level'),
          cell: (item) => (
            <Badge className={nivelVariant(item.nivel)}>
              {translateFloodLevel(item.nivel)}
            </Badge>
          ),
        },
        {
          header: t('table.status'),
          cell: (item) => (
            <Badge className={statusVariant(item.status)}>
              {translateFloodStatus(item.status)}
            </Badge>
          ),
        },
        {
          header: t('table.date'),
          cell: (item) => (
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {item.data}
            </span>
          ),
        },
      ]}
      actions={[
        {
          button: (item) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
              onClick={() => router.push(`/alagamentos/${item.id}`)}
              aria-label={t('actions.view')}
              title={t('actions.view')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          ),
        },
        {
          button: (item) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${item.lat},${item.lng}`,
                  '_blank'
                )
              }
              aria-label={t('actions.open-map')}
              title={t('actions.open-map')}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          ),
        },
      ]}
    />
  );
}
