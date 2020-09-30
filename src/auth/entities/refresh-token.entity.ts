import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RefreshTokenEntity extends AbstractEntity {
  @ManyToOne(
    (type) => UserEntity,
    (user) => user.refreshTokens
  )
  user: UserEntity;

  // This is a jwt token (one accessToken map to one refreshToken)
  @Column({ unique: true })
  accessTokenId: string;

  @Column({ default: false })
  invalidated: boolean;

  @Column()
  expiryDate: Date;
}
