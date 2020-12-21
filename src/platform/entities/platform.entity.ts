import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class PlatformEntity extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'base_url' })
  baseUrl: string;
}
