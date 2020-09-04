import { AbstractEntity } from 'src/common/abstract.entity';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class JobApplicationEntity extends AbstractEntity {
  @Column()
  applicationStatusPositition: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.jobApplications
  )
  user: UserEntity;

  @ManyToOne(
    (type) => JobApplicationStatusEntity,
    (status) => status.jobApplications
  )
  applicationStatus: JobApplicationStatusEntity;

  @ManyToOne(
    (type) => JobPostEntity,
    (post) => post.jobApplications
  )
  jobPost: JobPostEntity;
}
