import { MigrationInterface, QueryRunner } from 'typeorm';
import { runDbSeed } from '../seeds';

export class seed1600926763139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await runDbSeed(queryRunner.manager);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
