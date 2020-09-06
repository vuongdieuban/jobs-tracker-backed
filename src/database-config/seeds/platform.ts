import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { Connection } from 'typeorm';

export async function platformSeed(connection: Connection): Promise<PlatformEntity> {
  const repo = connection.getRepository<PlatformEntity>(PlatformEntity);

  const platform = repo.create({
    name: 'Indeed',
    baseUrl: 'https://indeed.ca'
  });

  return platform.save();
}
