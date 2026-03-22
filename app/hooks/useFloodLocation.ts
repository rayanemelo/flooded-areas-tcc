import { useFloodAreaForm } from '@/stores/flood-area-form';
import { useState } from 'react';
import { LatLng, MapPressEvent } from 'react-native-maps';

// const geocoding = new GeocondingService();

export function useFloodLocation() {
  const { floodAreaForm, setFloodAreaForm } = useFloodAreaForm();

  const [floodLocationCoordinates, setFloodLocationCoordinates] =
    useState<LatLng | null>(null); // Localização do ponto de enchente
  const [markerAddressModal, setMarkerAddressModal] = useState(false); // Modal de confirmação de endereço

  async function handleMapPress(event: MapPressEvent) {
    const coordinate = event.nativeEvent.coordinate;
    setFloodLocationCoordinates(coordinate);

    if (coordinate) {
      setMarkerAddressModal(true);
      // FIXME: Descomentar em Produção 
      // const address = await geocoding.getAddress(coordinate);

      setFloodAreaForm({
        ...floodAreaForm,
        longitude: coordinate.longitude,
        latitude: coordinate.latitude,
        address: 'Rua General Frota',
      });
    }
  }

  function resetFloodedAreaMarking() {
    setFloodLocationCoordinates(null);
    setMarkerAddressModal(false);
  }

  return {
    floodAreaForm,
    floodLocationCoordinates,
    handleMapPress,
    markerAddressModal,
    resetFloodedAreaMarking,
    setFloodLocationCoordinates,
  };
}
