import { AbstractEntity } from 'src/common/abstract.entity';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class JobApplicationStatusEntity extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(
    (type) => JobApplicationEntity,
    (jobApplication) => jobApplication.applicationStatus
  )
  jobApplications: JobApplicationEntity[];
}
