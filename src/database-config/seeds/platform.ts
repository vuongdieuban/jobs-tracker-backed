import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { Connection } from 'typeorm';

export async function platformSeed(
  connection: Connection,
  jobPosts: JobPostEntity[]
): Promise<PlatformEntity> {
  const repo = connection.getRepository<PlatformEntity>(PlatformEntity);

  const platform = repo.create({
    name: 'Indeed',
    baseUrl: 'https://indeed.ca',
    jobPosts
  });

  return platform.save();
}
