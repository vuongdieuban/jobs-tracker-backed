import { JobPostEntity } from 'src/shared/entities/job-post.entity';
import { EntityManager } from 'typeorm';

export async function jobPostsSeed(manager: EntityManager): Promise<JobPostEntity[]> {
  const repo = manager.getRepository<JobPostEntity>(JobPostEntity);
  const seeds = [
    {
      title: 'Dev1',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'abc',
    },
    {
      title: 'Dev2',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'def',
    },
    {
      title: 'Dev3',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'ijk',
    },
    {
      title: 'Dev4',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'ytr',
    },
    {
      title: 'Dev5',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'xyz',
    },
  ];

  const data = seeds.map(seed => repo.create(seed));
  return repo.save(data);
}
