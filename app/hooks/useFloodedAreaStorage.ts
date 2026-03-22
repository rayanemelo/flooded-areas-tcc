import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';

export function useFloodedAreaStorage() {
  // useEffect(() => {
  //   SecureStore.deleteItemAsync(`user_5_flood_128`);
  // }, []);

  const hasUserResponded = useCallback(
    async (userId: number, floodId: number): Promise<boolean> => {
      const key = `user_${userId}_flood_${floodId}`;
      try {
        const value = await SecureStore.getItemAsync(key);
        console.log('SecureStore.getItemAsync:', key, value);
        return value === 'true';
      } catch (error) {
        console.error('Erro ao buscar resposta no SecureStore:', error);
        return false;
      }
    },
    []
  );

  const storeUserResponse = async (userId: number, floodId: number) => {
    if (!userId) {
      console.error('Erro: userId é undefined');
      return;
    }

    const key = `user_${userId}_flood_${floodId}`;
    try {
      await SecureStore.setItemAsync(key, 'true');
    } catch (error) {
      console.error('Erro ao armazenar resposta no SecureStore:', error);
    }
  };
  return { hasUserResponded, storeUserResponse };
}
