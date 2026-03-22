import * as SecureStore from 'expo-secure-store';

export function useNativeLocalStorage() {
  async function storeData<T>(key: string, data: T) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  async function getStoredData<T>(key: string): Promise<T | null>;
  async function getStoredData<T>(key: string, defaultData: T): Promise<T>;
  async function getStoredData<T>(
    key: string,
    defaultData: T | null = null
  ): Promise<T | null> {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (!item) return defaultData;
      return JSON.parse(item) as T;
    } catch {
      return defaultData;
    }
  }

  async function deleteStoredData(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch {
      return false;
    }
  }

  return { storeData, getStoredData, deleteStoredData };
}
