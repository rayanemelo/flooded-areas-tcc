import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Coordinate } from '@/types/coordinate';

type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus>('undetermined');

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      console.log('Permissão de localização não concedida');
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return {
    userLocation,
    permissionStatus,
    requestLocationPermission,
  };
}
