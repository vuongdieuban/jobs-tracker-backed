import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ nullable: true, name: 'first_name' })
  firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ unique: true, name: 'email' })
  email: string;
}
