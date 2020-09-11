import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { getRepository } from 'typeorm';

export async function jobPostsSeed(): Promise<JobPostEntity[]> {
  const repo = getRepository<JobPostEntity>(JobPostEntity);
  const data = [
    {
      title: 'Dev1',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'abc'
    },
    {
      title: 'Dev2',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'def'
    },
    {
      title: 'Dev3',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'ijk'
    },
    {
      title: 'Dev4',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'ytr'
    },
    {
      title: 'Dev5',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC',
      platformJobKey: 'xyz'
    }
  ];

  const entities = data.map((d) => {
    const entity = repo.create(d);
    return entity.save();
  });

  return Promise.all(entities);
}
