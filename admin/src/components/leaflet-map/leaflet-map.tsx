'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';

export function createLucideMarker(level: string) {
  return L.divIcon({
    className: '',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="36" height="36"
        viewBox="0 0 24 24"
        fill="#3B6790"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z"/>
        <circle cx="12" cy="11" r="2"/>
      </svg>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// FIXME: corrigir tipagem | renderizar somente areas com status 'Aprovado'
export default function LeafletMap({ floodAreas }: any) {
  const { t } = useTranslation();

  return (
    <MapContainer
      center={[-29.6509, -50.7814]}
      zoom={14}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {floodAreas.map((area: any) => (
        <Marker
          key={area.id}
          position={[area.latitude, area.longitude]}
          icon={createLucideMarker(area.level)}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{area.address}</p>
              <p>
                {t('map.popup.level')}: {area.level}
              </p>
              <p>
                {t('map.popup.status')}: {area.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
