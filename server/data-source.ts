import { boolean } from 'boolean';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { NamingStrategy } from './src/common/configs/typeorm.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

let config: DataSourceOptions & PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  logger: 'simple-console',
  extra: {
    options: '-c lock_timeout=60000ms',
  },
  logging: boolean(process.env.SHOW_SQL),
  migrationsTransactionMode: 'all',
  namingStrategy: new NamingStrategy(),
};

export const dataSource = new DataSource(config);
