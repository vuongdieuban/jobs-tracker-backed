import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class JobApplicationEntity extends AbstractEntity {
  @Column()
  applicationStatusPositition: number;
}
