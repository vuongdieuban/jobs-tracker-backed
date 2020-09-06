import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { Connection, Entity } from 'typeorm';

export async function jobPostsSeed(connection: Connection): Promise<JobPostEntity[]> {
  const repo = connection.getRepository<JobPostEntity>(JobPostEntity);
  const data = [
    {
      title: 'Dev1',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC'
    },
    {
      title: 'Dev2',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC'
    },
    {
      title: 'Dev3',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC'
    },
    {
      title: 'Dev4',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC'
    },
    {
      title: 'Dev5',
      url: 'a.com',
      companyName: 'ComA',
      location: 'BC'
    }
  ];

  const entities = data.map((d) => {
    const entity = repo.create(d);
    return entity.save();
  });

  return Promise.all(entities);
}
