import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const AppDS = new DataSource({
  type: 'postgres',
  entities: [__dirname + 'entity/*.entity.ts'],
  migrations: [__dirname + 'migrations/*.entity.ts'],
  synchronize: true,
  url: process.env.DB_URL,
  ssl: { rejectUnauthorized: true },
});

AppDS.initialize()
  .then(() => console.log('init'))
  .catch((e) => console.log('failed', e.message));

export default AppDS;
