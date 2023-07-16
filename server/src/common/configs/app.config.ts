import * as dotenv from 'dotenv';
import { AppEnvironment } from '../enums/app.enum';
import { RecursiveKeyOf } from '../types/utils.type';
dotenv.config();

const appConfig = {
  environment: process.env.NODE_ENV,
  port: +process.env.PORT || 5000,

  cloudinary: {
    url: process.env.CLOUDINARY_URL,
    preset: process.env.CLOUDINARY_PRESET || 'graphql_blog'
  },

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },
  },
};

export default appConfig;
export type AppConfig = Record<RecursiveKeyOf<typeof appConfig>, string>;
