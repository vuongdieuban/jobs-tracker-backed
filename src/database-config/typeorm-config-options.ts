import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// NOTE: synchornize should be false in prod, synchromize tells typeorm to auto update/make migration based on our entity code when it changes,
// This synchronize will overwrite our migration change back whatever the current entity model is
// Currently there isn't any migration code to create table, so initially if synchonize is off when boot up the db, no table will be created
export const typeormConfigOptions: TypeOrmModuleOptions = {
  synchronize: true,
  name: 'default',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  dropSchema: false,
  logging: true,
  entities: ['dist/**/*.entity.js'],

  migrationsTableName: 'migration',
  migrations: ['dist/database-config/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database-config/migrations'
  }
};
