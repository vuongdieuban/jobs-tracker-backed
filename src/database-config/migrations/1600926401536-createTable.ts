import {MigrationInterface, QueryRunner} from "typeorm";

export class createTable1600926401536 implements MigrationInterface {
    name = 'createTable1600926401536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "platform_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "baseUrl" character varying NOT NULL, CONSTRAINT "PK_ad26ad68861322f0ec769b5b7e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_post_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "title" character varying NOT NULL, "companyName" character varying NOT NULL, "url" character varying NOT NULL, "location" character varying NOT NULL, "platformJobKey" character varying NOT NULL, "platformId" uuid, CONSTRAINT "UQ_ec69a7306d3b901d230a3770d4c" UNIQUE ("platformJobKey", "platformId"), CONSTRAINT "PK_51a7958d842a0f0a1c1b7414c40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "googleId" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "UQ_45c19f7b63cce4d0651736c2c79" UNIQUE ("googleId"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_application_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "statusDisplayPosition" integer NOT NULL, "userId" uuid, "statusId" uuid, "jobPostId" uuid, CONSTRAINT "UQ_84db565972de24ca62e041bbe19" UNIQUE ("userId", "jobPostId"), CONSTRAINT "PK_f64ff975b35e56b358864419699" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_application_status_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_ts" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_fd56eda3f9f17ec86a76a6c0e7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job_post_entity" ADD CONSTRAINT "FK_e2926325e6ec5a7c9006bae191c" FOREIGN KEY ("platformId") REFERENCES "platform_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application_entity" ADD CONSTRAINT "FK_2aa1c45713b11d6282d1cc5575c" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application_entity" ADD CONSTRAINT "FK_5aca7be4abd9b3df9fe746fb9ac" FOREIGN KEY ("statusId") REFERENCES "job_application_status_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application_entity" ADD CONSTRAINT "FK_00bff32c51c4e502c7e87638124" FOREIGN KEY ("jobPostId") REFERENCES "job_post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_application_entity" DROP CONSTRAINT "FK_00bff32c51c4e502c7e87638124"`);
        await queryRunner.query(`ALTER TABLE "job_application_entity" DROP CONSTRAINT "FK_5aca7be4abd9b3df9fe746fb9ac"`);
        await queryRunner.query(`ALTER TABLE "job_application_entity" DROP CONSTRAINT "FK_2aa1c45713b11d6282d1cc5575c"`);
        await queryRunner.query(`ALTER TABLE "job_post_entity" DROP CONSTRAINT "FK_e2926325e6ec5a7c9006bae191c"`);
        await queryRunner.query(`DROP TABLE "job_application_status_entity"`);
        await queryRunner.query(`DROP TABLE "job_application_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "job_post_entity"`);
        await queryRunner.query(`DROP TABLE "platform_entity"`);
    }

}
