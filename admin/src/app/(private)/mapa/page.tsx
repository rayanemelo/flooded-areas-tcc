'use client';

import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useFloodArea } from '@/hooks/use-flood-area';
import { mapFloodLevel, mapStatus } from '@/utils/mapping';

const LeafletMap = dynamic(
  () => import('@/components/leaflet-map/leaflet-map'),
  {
    ssr: false,
  }
);

export default function MapaPage() {
  const { t } = useTranslation();
  const { floodAreaList, isLoading, error } = useFloodArea();

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

  const mapData = useMemo(() => {
    return (floodAreaList ?? [])
      .map((item) => ({
        id: item.id,
        address: item.address,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        status: translateFloodStatus(mapStatus(item.status)),
        level: translateFloodLevel(mapFloodLevel(item.floodLevelId)),
      }))
      .filter(
        (item) =>
          Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
      );
  }, [floodAreaList, t]);

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{t('map.title')}</h1>

      <div className="h-150 w-full overflow-hidden rounded-lg border">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t('map.loading')}
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            {t('map.load-error')}
          </div>
        ) : (
          <LeafletMap floodAreas={mapData} />
        )}
      </div>
    </div>
  );
}
