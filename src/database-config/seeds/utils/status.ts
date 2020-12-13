import { StatusEntity } from 'src/shared/entities/status.entity';
import { EntityManager } from 'typeorm';

export async function statusSeed(manager: EntityManager): Promise<StatusEntity[]> {
  const repo = manager.getRepository<StatusEntity>(StatusEntity);
  const seeds = [{ name: 'Applied' }, { name: 'Wish List' }, { name: 'Interviewed' }];
  const data = seeds.map(seed => repo.create(seed));
  return repo.save(data);
}
