import { RefreshTokenEntity } from 'src/auth/entities/refresh-token.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ nullable: true, name: 'first_name' })
  firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ unique: true, name: 'email' })
  email: string;

  @OneToMany(
    (type) => JobApplicationEntity,
    (jobApplication) => jobApplication.user
  )
  jobApplications: JobApplicationEntity[];

  @OneToMany(
    (type) => RefreshTokenEntity,
    (refreshToken) => refreshToken.user
  )
  refreshTokens: RefreshTokenEntity[];
}
