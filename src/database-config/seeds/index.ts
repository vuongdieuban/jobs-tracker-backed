import { createConnection } from 'typeorm';
import { applicationStatusSeed } from './application-status';
import { jobPostsSeed } from './job-post';
import { platformSeed } from './platform';
import { userSeed } from './user';

export async function runDbSeed() {
  const connection = await createConnection({
    name: 'seedConnection',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity.js']
  });

  const [status, user, jobPosts, platform] = await Promise.all([
    applicationStatusSeed(connection),
    userSeed(connection),
    jobPostsSeed(connection),
    platformSeed(connection)
  ]);

  await connection.close();
}
