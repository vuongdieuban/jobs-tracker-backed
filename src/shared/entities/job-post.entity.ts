import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { JobApplicationEntity } from 'src/shared/entities/job-application.entity';
import { PlatformEntity } from 'src/shared/entities/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['platformJobKey', 'platform'])
export class JobPostEntity extends AbstractEntity {
  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'platform_job_key' })
  platformJobKey: string;

  @ManyToOne(
    type => PlatformEntity,
    platform => platform.jobPosts,
  )
  @JoinColumn({ name: 'platform_id' })
  platform: PlatformEntity;

  @OneToMany(
    type => JobApplicationEntity,
    jobApplication => jobApplication.jobPost,
  )
  jobApplications: JobApplicationEntity[];
}
