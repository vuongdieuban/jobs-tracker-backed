import { StatusEntity } from 'src/shared/entities/status.entity';
import { EntityManager } from 'typeorm';

export async function statusSeed(manager: EntityManager): Promise<StatusEntity[]> {
  const repo = manager.getRepository<StatusEntity>(StatusEntity);
  const data = repo.create([{ name: 'Applied' }, { name: 'Wish List' }, { name: 'Interviewed' }]);
  return repo.save(data);
}
