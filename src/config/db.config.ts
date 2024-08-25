import { registerAs } from '@nestjs/config';

interface IDBConfig {
  url: string;
}

export const postgresConfig = registerAs<IDBConfig>(
  'db',
  (): IDBConfig => ({
    url: process.env.DATABASE_URL,
  }),
);
