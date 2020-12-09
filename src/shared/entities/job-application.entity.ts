import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { JobApplicationStatusEntity } from 'src/shared/entities/job-application-status.entity';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
import { UserEntity } from 'src/shared/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
// unique composite key, one user should only have one application to a single jobPost. NOTE: field names (not database column names)
@Unique(['user', 'jobPost'])
export class JobApplicationEntity extends AbstractEntity {
  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'archive', default: false })
  archive: boolean;

  @ManyToOne(
    type => UserEntity,
    user => user.jobApplications,
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    type => JobApplicationStatusEntity,
    status => status.jobApplications,
  )
  @JoinColumn({ name: 'status_id' })
  status: JobApplicationStatusEntity;

  @ManyToOne(
    type => JobPostEntity,
    post => post.jobApplications,
  )
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPostEntity;
}
