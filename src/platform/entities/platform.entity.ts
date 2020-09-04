import { AbstractEntity } from 'src/common/abstract.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class PlatformEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  baseUrl: string;

  @OneToMany(
    (type) => JobPostEntity,
    (jobPost) => jobPost.platform
  )
  jobPosts: JobPostEntity[];
}
