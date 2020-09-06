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
      applicationStatusPositition: 0,
      applicationStatus: status[0],
      jobPost: jobPosts[0],
      user
    },
    {
      applicationStatusPositition: 1,
      applicationStatus: status[0],
      jobPost: jobPosts[1],
      user
    },
    {
      applicationStatusPositition: 2,
      applicationStatus: status[0],
      jobPost: jobPosts[2],
      user
    },
    {
      applicationStatusPositition: 0,
      applicationStatus: status[1],
      jobPost: jobPosts[3],
      user
    },
    {
      applicationStatusPositition: 1,
      applicationStatus: status[1],
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
