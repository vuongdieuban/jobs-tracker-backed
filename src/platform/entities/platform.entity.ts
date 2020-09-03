import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class PlatformEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  baseUrl: string;
}
