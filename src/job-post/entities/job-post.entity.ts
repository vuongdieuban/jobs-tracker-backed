import { AbstractEntity } from 'src/common/abstract.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class JobPostEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  companyName: string;

  @Column()
  url: string;

  @Column()
  location: string;

  @OneToMany(
    (type) => JobApplicationEntity,
    (jobApplication) => jobApplication.jobPost
  )
  jobApplications: JobApplicationEntity[];

  @ManyToOne(
    (type) => PlatformEntity,
    (platform) => platform.jobPosts
  )
  platform: PlatformEntity;
}
