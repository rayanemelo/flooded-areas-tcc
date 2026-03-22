import { Request, Response } from 'express';
import { TokenServiceJWT } from '../service/token-service-jwt';
import { NextFunction } from 'express-serve-static-core';
import { UserEntity } from '../../domain/entities/user/user-entity';

const tokenService = new TokenServiceJWT();

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  console.log('authorize middleware');

  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = accessToken.split(' ')[1];
    const { user } = tokenService.verifyToken<{
      user: UserEntity;
      iat: number;
      exp: number;
    }>(token);

    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
