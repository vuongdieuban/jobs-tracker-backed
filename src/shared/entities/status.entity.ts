import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class StatusEntity extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;
}
