import { getRepository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export async function userSeed(): Promise<UserEntity> {
  const repo = getRepository<UserEntity>(UserEntity);

  const user = repo.create({
    lastName: 'vuong',
    firstName: 'ban',
    email: 'vuongdieuban@gmail.com',
    googleId: 'abc123'
  });

  return user.save();
}
