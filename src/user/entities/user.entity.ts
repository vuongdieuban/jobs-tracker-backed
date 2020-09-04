import { AbstractEntity } from 'src/common/abstract.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  googleId: string;

  @OneToMany(
    (type) => JobApplicationEntity,
    (jobApplication) => jobApplication.user
  )
  jobApplications: JobApplicationEntity[];
}
