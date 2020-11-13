import { Exclude } from 'class-transformer';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// BaseEntity gives Repository function such as findOne, create, ...
export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TransformInterceptor will exclude these properties before the data
  @Exclude()
  @CreateDateColumn({
    name: 'created_ts',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTs: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_ts',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedTs: Date;
}
