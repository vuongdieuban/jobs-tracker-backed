import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { EntityManager } from 'typeorm';

export async function jobPostsSeed(
  manager: EntityManager,
  platform: PlatformEntity,
): Promise<JobPostEntity[]> {
  const repo = manager.getRepository<JobPostEntity>(JobPostEntity);
  const data = repo.create([
    {
      title: 'Dev1',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'abc',
      platform,
    },
    {
      title: 'Dev2',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'def',
      platform,
    },
    {
      title: 'Dev3',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'ijk',
      platform,
    },
    {
      title: 'Dev4',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'ytr',
      platform,
    },
    {
      title: 'Dev5',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'xyz',
      platform,
    },
  ]);

  return repo.save(data);
}
