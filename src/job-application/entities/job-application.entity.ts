import { AbstractEntity } from 'src/common/abstract.entity';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
// unique composite key, one user should only have one application to a single jobPost. NOTE: field names (not database column names)
@Unique(['user', 'jobPost'])
export class JobApplicationEntity extends AbstractEntity {
  @Column()
  statusDisplayPosition: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.jobApplications
  )
  user: UserEntity;

  @ManyToOne(
    (type) => JobApplicationStatusEntity,
    (status) => status.jobApplications
  )
  status: JobApplicationStatusEntity;

  @ManyToOne(
    (type) => JobPostEntity,
    (post) => post.jobApplications
  )
  jobPost: JobPostEntity;
}
