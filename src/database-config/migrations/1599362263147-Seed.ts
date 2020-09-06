import { MigrationInterface, QueryRunner } from 'typeorm';
import { runDbSeed } from '../seeds';

export class Seed1599362263147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await runDbSeed();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
