import { applicationStatusSeed } from './application-status';
import { jobApplicationsSeed } from './job-application';
import { jobPostsSeed } from './job-post';
import { platformSeed } from './platform';
import { userSeed } from './user';

export async function runDbSeed() {
  const [status, user, jobPosts] = await Promise.all([applicationStatusSeed(), userSeed(), jobPostsSeed()]);

  await platformSeed(jobPosts);
  await jobApplicationsSeed(user, status, jobPosts);
}
