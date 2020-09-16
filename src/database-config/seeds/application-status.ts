import { getRepository } from 'typeorm';
import { JobApplicationStatusEntity } from '../../job-application-status/entities/job-application-status.entity';

export async function applicationStatusSeed(): Promise<JobApplicationStatusEntity[]> {
  const repo = getRepository<JobApplicationStatusEntity>(JobApplicationStatusEntity);
  const data = [{ name: 'Applied' }, { name: 'Wish List' }, { name: 'Archived' }];

  const entities = data.map((d) => {
    const entity = repo.create(d);
    return entity.save();
  });

  return Promise.all(entities);
}
