import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// BaseEntity gives Repository function such as findOne, create, ...
export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_ts',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdTs: Date;

  @UpdateDateColumn({
    name: 'updated_ts',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedTs: Date;
}
