'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useFloodArea } from '@/hooks/use-flood-area';
import { formatDateTime } from '@/utils/format-date-time';
import { AlagamentosFilters } from './components/alagamentos-filters';
import { AlagamentosTable } from './components/alagamentos-table';
import { mapFloodLevel, mapStatus } from '@/utils/mapping';

export default function AlagamentosPage() {
  const { t } = useTranslation();
  const [nivel, setNivel] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { floodAreaList } = useFloodArea();

  const tableData = useMemo(() => {
    return (floodAreaList ?? []).map((item) => ({
      id: String(item.id),
      endereco: item.address,
      nivel: mapFloodLevel(item.floodLevelId),
      status: mapStatus(item.status),
      active: item.active,
      data: formatDateTime(item.createdAt),
      lat: Number(item.latitude),
      lng: Number(item.longitude),
    }));
  }, [floodAreaList]);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchNivel = nivel ? item.nivel === nivel : true;
      const matchStatus = status ? item.status === status : true;

      return matchNivel && matchStatus;
    });
  }, [tableData, nivel, status]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">{t('menu.alagamentos')}</h1>

        <AlagamentosFilters
          nivel={nivel}
          status={status}
          onNivelChange={setNivel}
          onStatusChange={setStatus}
        />
      </header>

      <AlagamentosTable data={filteredData} />
    </div>
  );
}
