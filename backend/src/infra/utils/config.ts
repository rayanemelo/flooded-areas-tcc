export const CONFIG = {
  auth: {
    secret: process.env.AUTH_SECRET || 'your_secret_key',
    expiresIn: Number(process.env.AUTH_EXPIRES_IN_SECONDS || 28800),
  },
  encryption: {
    secret: process.env.ENCRYPTION_SECRET || 'your_encryption_secret',
  },
};
