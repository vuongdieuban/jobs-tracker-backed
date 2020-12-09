import { UserEntity } from 'src/shared/entities/user.entity';
import { EntityManager } from 'typeorm';

export async function userSeed(manager: EntityManager): Promise<UserEntity> {
  const repo = manager.getRepository<UserEntity>(UserEntity);

  const user = repo.create({
    lastName: 'vuong',
    firstName: 'ban',
    email: 'vuongdieuban@gmail.com',
  });

  return repo.save(user);
}
