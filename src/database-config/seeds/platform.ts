import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { getRepository } from 'typeorm';

export async function platformSeed(jobPosts: JobPostEntity[]): Promise<PlatformEntity> {
  const repo = getRepository<PlatformEntity>(PlatformEntity);

  const platform = repo.create({
    name: 'Indeed',
    baseUrl: 'https://indeed.ca',
    jobPosts
  });

  return platform.save();
}
