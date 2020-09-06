import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';

export async function jobApplicationsSeed(
  user: UserEntity,
  status: JobApplicationStatusEntity[],
  jobPosts: JobPostEntity[]
): Promise<JobApplicationEntity[]> {
  const repo = getRepository<JobApplicationEntity>(JobApplicationEntity);
  const data = [
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

  const entities = data.map((d) => {
    const entity = repo.create(d);
    return entity.save();
  });

  return Promise.all(entities);
}
