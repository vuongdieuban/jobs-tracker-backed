import { Connection } from 'typeorm';
import { JobApplicationStatusEntity } from '../../job-application-status/entities/job-application-status.entity';

export async function applicationStatusSeed(connection: Connection): Promise<JobApplicationStatusEntity[]> {
  const statusRepo = connection.getRepository<JobApplicationStatusEntity>(JobApplicationStatusEntity);

  const status1 = statusRepo.create();
  status1.name = 'Applied';

  const status2 = statusRepo.create();
  status2.name = 'Wish List';

  return Promise.all([status1.save(), status2.save()]);
}
