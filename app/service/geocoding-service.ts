import { LatLng } from 'react-native-maps';
import { API_GEOCODE } from './api';
import { GeocodingResponse } from '@/types/geocoding-response';
import { AUTH_KEY_GEOCONDING_API } from '@/constants';

export class GeocondingService {
  async getAddress(coordinate: LatLng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${AUTH_KEY_GEOCONDING_API}`;
    try {
      const response = await API_GEOCODE.get(url);

      const { results } = response.data as GeocodingResponse;

      return results[0].formatted_address;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
