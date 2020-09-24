import { Connection } from 'typeorm';
import { applicationStatusSeed } from './application-status';
import { jobApplicationsSeed } from './job-application';
import { jobPostsSeed } from './job-post';
import { platformSeed } from './platform';
import { userSeed } from './user';

export async function runDbSeed(connection: Connection) {
  const [status, user, jobPosts] = await Promise.all([
    applicationStatusSeed(connection),
    userSeed(connection),
    jobPostsSeed(connection)
  ]);

  await platformSeed(connection, jobPosts);
  await jobApplicationsSeed(connection, user, status, jobPosts);
}
