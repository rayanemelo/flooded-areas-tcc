import jwt from 'jsonwebtoken';

import { ITokenService } from '../../domain/services/token-service';
import { CONFIG } from '../utils/config';
import { Exception } from '../exception/exception';
import { messages } from '../config/messages';

export class TokenServiceJWT implements ITokenService {
  private readonly config = CONFIG.auth;

  public generateToken<T extends object>(payload: T): string {
    return jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn,
    });
  }

  public verifyToken<T extends object>(token: string): T {
    try {
      return jwt.verify(token, this.config.secret) as T;
    } catch (error) {
      throw new Exception(401, messages.response.invalidToken);
    }
  }
}
