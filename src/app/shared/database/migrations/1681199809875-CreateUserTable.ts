import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1681199809875 implements MigrationInterface {
    name = 'CreateUserTable1681199809875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listnotes"."user" ("id" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "dthr_create" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "listnotes"."user"`);
    }

}
