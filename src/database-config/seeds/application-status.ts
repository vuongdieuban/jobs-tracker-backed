import { Connection } from 'typeorm';
import { JobApplicationStatusEntity } from '../../job-application-status/entities/job-application-status.entity';

export async function applicationStatusSeed(connection: Connection): Promise<JobApplicationStatusEntity[]> {
  const repo = connection.getRepository<JobApplicationStatusEntity>(JobApplicationStatusEntity);
  const data = [{ name: 'Applied' }, { name: 'Wish List' }, { name: 'Archived' }];

  const entities = data.map((d) => {
    const entity = repo.create(d);
    return entity.save();
  });

  return Promise.all(entities);
}
