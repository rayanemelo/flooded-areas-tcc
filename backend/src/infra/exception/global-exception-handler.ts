import { Response } from 'express';
import { Exception } from './exception';
import { ZodError } from 'zod';
import { messages } from '../config/messages';

export class GlobalExceptionHandler {
  static handle(error: unknown, res: Response) {
    console.error('error: ', error);

    if (error instanceof ZodError) {
      return res.status(400).json(error);
    }

    if (error instanceof Exception) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(500).json({ message: messages.response.internalServerError });
  }
}
