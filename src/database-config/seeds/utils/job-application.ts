import { SPACE_BETWEEN_ITEM } from 'src/shared/constants';
import { StatusEntity } from 'src/status/entities/status.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';

export async function jobApplicationsSeed(
  manager: EntityManager,
  user: UserEntity,
  status: StatusEntity[],
  jobPosts: JobPostEntity[],
): Promise<JobApplicationEntity[]> {
  const repo = manager.getRepository<JobApplicationEntity>(JobApplicationEntity);
  const data = repo.create([
    {
      position: SPACE_BETWEEN_ITEM,
      status: status[0],
      jobPost: jobPosts[0],
      user,
    },
    {
      position: 2 * SPACE_BETWEEN_ITEM,
      status: status[0],
      jobPost: jobPosts[1],
      user,
    },
    {
      position: 3 * SPACE_BETWEEN_ITEM,
      status: status[0],
      jobPost: jobPosts[2],
      user,
    },
    {
      position: SPACE_BETWEEN_ITEM,
      status: status[1],
      jobPost: jobPosts[3],
      user,
    },
    {
      position: 2 * SPACE_BETWEEN_ITEM,
      status: status[1],
      jobPost: jobPosts[4],
      user,
    },
  ]);

  return repo.save(data);
}
