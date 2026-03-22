export interface ITokenService {
  generateToken<T extends object>(payload: T): string;
  verifyToken<T extends object>(token: string): T;
}
