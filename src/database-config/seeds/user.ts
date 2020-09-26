import { EntityManager } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export async function userSeed(manager: EntityManager): Promise<UserEntity> {
  const repo = manager.getRepository<UserEntity>(UserEntity);

  const user = repo.create({
    lastName: 'vuong',
    firstName: 'ban',
    email: 'vuongdieuban@gmail.com',
    googleId: 'abc123'
  });

  return repo.save(user);
}
