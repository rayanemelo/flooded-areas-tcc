import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  JwtDecode,
  verifyTokenExpirationTime,
} from '../utils/functions/jwt-verify';
import { useNativeLocalStorage } from './useNativeLocalStorage';
import { useUserAccess } from '@/stores/user-access';
import { User } from '@/types/user';

export const TOKEN_KEY = 'mytoken';

export function useAuthentication() {
  const { storeData, getStoredData, deleteStoredData } =
    useNativeLocalStorage();
  const { setUser, resetUser } = useUserAccess();
  const [authentication, setAuthentication] = useState({
    token: '',
    authenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  async function verifyToken() {
    const token = await getStoredData<string>(TOKEN_KEY);

    if (token) {
      try {
        const decoded = jwtDecode<JwtDecode>(token);
        const user = decoded.user as User;

        const isTokenValid = verifyTokenExpirationTime(decoded);

        if (!isTokenValid) {
          await deleteStoredData(TOKEN_KEY);
        } else {
          setAuthentication({ token, authenticated: true });
          setUser(user);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  async function setAuthenticated(token: string) {
    const decoded = jwtDecode<JwtDecode>(token);
    const user: User = decoded.user;

    setUser(user);

    setAuthentication({
      token: token,
      authenticated: true,
    });

    await storeData(TOKEN_KEY, token);
  }

  async function signOut() {
    setAuthentication({
      token: '',
      authenticated: false,
    });

    resetUser();
    await deleteStoredData(TOKEN_KEY);
  }

  useEffect(() => {
    verifyToken();
  }, []);

  return {
    authentication,
    isLoading,
    setAuthenticated,
    signOut,
  };
}
