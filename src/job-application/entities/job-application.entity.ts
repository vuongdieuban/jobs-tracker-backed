import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { StatusEntity } from 'src/status/entities/status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
// Unique composite key, one user should only have one application to a single jobPost.  NOTE: class fields name (not database column names)
@Unique(['user', 'jobPost'])
export class JobApplicationEntity extends AbstractEntity {
  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'archive', default: false })
  archive: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @ManyToOne(() => JobPostEntity)
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPostEntity;
}
