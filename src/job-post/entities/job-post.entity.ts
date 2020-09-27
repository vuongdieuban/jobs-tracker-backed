import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['platformJobKey', 'platform'])
export class JobPostEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  companyName: string;

  @Column()
  url: string;

  @Column()
  location: string;

  @Column()
  platformJobKey: string;

  @ManyToOne(
    (type) => PlatformEntity,
    (platform) => platform.jobPosts
  )
  platform: PlatformEntity;

  @OneToMany(
    (type) => JobApplicationEntity,
    (jobApplication) => jobApplication.jobPost
  )
  jobApplications: JobApplicationEntity[];
}
