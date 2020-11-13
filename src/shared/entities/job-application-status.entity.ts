import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { JobApplicationEntity } from 'src/shared/entities/job-application.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class JobApplicationStatusEntity extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @OneToMany(
    type => JobApplicationEntity,
    jobApplication => jobApplication.status,
  )
  jobApplications: JobApplicationEntity[];
}
