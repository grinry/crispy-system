import { resolve } from 'path';
import { config as load } from 'dotenv';

load({ path: resolve(__dirname, '../.env')});

export const config = {
  port: process.env.PORT,
};
