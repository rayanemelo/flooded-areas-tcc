import { API } from './api';
import type { Coordinate } from '@/types/coordinate';

export class AuthService {
  public async sendCode(phone: string, userLocation?: Coordinate | null) {
    try {
      const payload = {
        phone,
        ...(userLocation
          ? {
            userLocation: {
              latitude: userLocation.latitude.toString(),
              longitude: userLocation.longitude.toString(),
            },
          }
          : {}),
      };

      return await API.post('/auth-user/send-sms', {
        ...payload,
      });
    } catch (e) {
      console.log('e: ', e);
    }
  }

  public async verifyCode(phone: string, code: string) {
    try {
      return await API.post('/auth-user/validate-code', {
        phone,
        code,
      });
    } catch (e) {
      console.log('e: ', e);
    }
  }
}
