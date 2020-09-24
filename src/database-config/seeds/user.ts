import { Connection } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export async function userSeed(connection: Connection): Promise<UserEntity> {
  const repo = connection.getRepository<UserEntity>(UserEntity);

  const user = repo.create({
    lastName: 'vuong',
    firstName: 'ban',
    email: 'vuongdieuban@gmail.com',
    googleId: 'abc123'
  });

  return user.save();
}
