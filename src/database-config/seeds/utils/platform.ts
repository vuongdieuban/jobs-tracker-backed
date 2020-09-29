import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { EntityManager } from 'typeorm';

export async function platformSeed(
  manager: EntityManager,
  jobPosts: JobPostEntity[]
): Promise<PlatformEntity> {
  const repo = manager.getRepository<PlatformEntity>(PlatformEntity);

  const platform = repo.create({
    name: 'Indeed',
    baseUrl: 'https://indeed.ca',
    jobPosts
  });

  return repo.save(platform);
}
