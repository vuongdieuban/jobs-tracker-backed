import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

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

  @ManyToOne(() => PlatformEntity)
  @JoinColumn({ name: 'platform_id' })
  platform: PlatformEntity;
}
