
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JobPostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  url: string;
}