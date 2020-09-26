import { EntityManager } from 'typeorm';
import { applicationStatusSeed } from './application-status';
import { jobApplicationsSeed } from './job-application';
import { jobPostsSeed } from './job-post';
import { platformSeed } from './platform';
import { userSeed } from './user';

export async function runDbSeed(manager: EntityManager) {
  const [status, user, jobPosts] = await Promise.all([
    applicationStatusSeed(manager),
    userSeed(manager),
    jobPostsSeed(manager)
  ]);

  await platformSeed(manager, jobPosts);
  await jobApplicationsSeed(manager, user, status, jobPosts);
}
