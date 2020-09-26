import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';

export async function jobApplicationsSeed(
  manager: EntityManager,
  user: UserEntity,
  status: JobApplicationStatusEntity[],
  jobPosts: JobPostEntity[]
): Promise<JobApplicationEntity[]> {
  const repo = manager.getRepository<JobApplicationEntity>(JobApplicationEntity);
  const seeds = [
    {
      statusDisplayPosition: 0,
      status: status[0],
      jobPost: jobPosts[0],
      user
    },
    {
      statusDisplayPosition: 1,
      status: status[0],
      jobPost: jobPosts[1],
      user
    },
    {
      statusDisplayPosition: 2,
      status: status[0],
      jobPost: jobPosts[2],
      user
    },
    {
      statusDisplayPosition: 0,
      status: status[1],
      jobPost: jobPosts[3],
      user
    },
    {
      statusDisplayPosition: 1,
      status: status[1],
      jobPost: jobPosts[4],
      user
    }
  ];

  const data = seeds.map((seed) => repo.create(seed));
  return repo.save(data);
}
