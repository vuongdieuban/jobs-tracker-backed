import { EntityManager } from 'typeorm';
import { statusSeed } from './status';
import { jobApplicationsSeed } from './job-application';
import { jobPostsSeed } from './job-post';
import { platformSeed } from './platform';
import { userSeed } from './user';

export async function runDbSeed(manager: EntityManager) {
  const [status, user, platform] = await Promise.all([
    statusSeed(manager),
    userSeed(manager),
    platformSeed(manager),
  ]);

  const jobPosts = await jobPostsSeed(manager, platform);
  await jobApplicationsSeed(manager, user, status, jobPosts);
}
