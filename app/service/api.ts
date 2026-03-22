import { TOKEN_KEY } from '@/hooks/useAuthentication';
import { useNativeLocalStorage } from '@/hooks/useNativeLocalStorage';
import axios from 'axios';

export const API = axios.create({
  baseURL: `http://192.168.2.108:3331/api`, // hostname -I
});

API.interceptors.request.use(async (config) => {
  const { getStoredData } = useNativeLocalStorage();
  const token = await getStoredData(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_GEOCODE = axios.create({
  baseURL: `https://maps.googleapis.com/maps/api/geocode/json`,
});
