import { PlatformEntity } from 'src/shared/entities/platform.entity';
import { EntityManager } from 'typeorm';

export async function platformSeed(manager: EntityManager): Promise<PlatformEntity> {
  const repo = manager.getRepository<PlatformEntity>(PlatformEntity);

  const platform = repo.create({
    name: 'Indeed',
    baseUrl: 'https://indeed.ca',
  });

  return repo.save(platform);
}
