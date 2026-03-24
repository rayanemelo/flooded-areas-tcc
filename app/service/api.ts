import { TOKEN_KEY } from '@/hooks/useAuthentication';
import { useNativeLocalStorage } from '@/hooks/useNativeLocalStorage';
import { useBackendStatus } from '@/stores/backend-status';
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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined;
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error';

    if (status === 503 || status === 504 || isNetworkError) {
      useBackendStatus.getState().showOutageModal();
    }

    return Promise.reject(error);
  }
);

export const API_GEOCODE = axios.create({
  baseURL: `https://maps.googleapis.com/maps/api/geocode/json`,
});
