
import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class JobPostEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  companyName: string;

  @Column()
  url: string;
}