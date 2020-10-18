import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class PlatformEntity extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'base_url' })
  baseUrl: string;

  @OneToMany(
    (type) => JobPostEntity,
    (jobPost) => jobPost.platform
  )
  jobPosts: JobPostEntity[];
}
