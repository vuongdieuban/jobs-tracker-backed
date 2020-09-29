import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { EntityManager } from 'typeorm';

export async function applicationStatusSeed(manager: EntityManager): Promise<JobApplicationStatusEntity[]> {
  const repo = manager.getRepository<JobApplicationStatusEntity>(JobApplicationStatusEntity);
  const seeds = [{ name: 'Applied' }, { name: 'Wish List' }, { name: 'Archived' }];
  const data = seeds.map((seed) => repo.create(seed));
  return repo.save(data);
}
