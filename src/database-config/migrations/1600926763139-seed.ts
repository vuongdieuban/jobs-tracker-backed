import { getConnection, MigrationInterface, QueryRunner } from 'typeorm';
import { runDbSeed } from '../seeds';

export class seed1600926763139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // const conn = await queryRunner.connect();
    const conn = getConnection();
    await runDbSeed(conn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
