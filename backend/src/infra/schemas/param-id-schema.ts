import { z } from 'zod';

export const paramIdSchema = z.object({
  id: z.coerce.number(),
});
