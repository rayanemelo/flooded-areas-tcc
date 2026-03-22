import { User } from '@/types/user';
import type { JwtPayload } from 'jwt-decode';

export type JwtDecode = JwtPayload & {
  uxp: number;
  iat: number;
  user: User;
};

export function verifyTokenExpirationTime(decodedToken: JwtDecode) {
  const now = Math.floor(Date.now() / 1000);
  const tokenExpirationTime = decodedToken.exp ?? 0;

  if (tokenExpirationTime > now) {
    return true; // token is valid
  }

  return false;
}
