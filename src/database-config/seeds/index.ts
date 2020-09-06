import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { createConnection } from 'typeorm';
import { applicationStatusSeed } from './application-status';

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

  const jobApplicationRepo = connection.getRepository<JobApplicationEntity>(JobApplicationEntity);
  const applicationStatuses = await applicationStatusSeed(connection);

  await connection.close();
}
