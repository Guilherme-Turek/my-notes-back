import { MigrationInterface, QueryRunner } from "typeorm";

export class TestsMigration1684179907791 implements MigrationInterface {
    name = 'TestsMigration1684179907791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "dthr_create" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "note" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('active','filed') ) NOT NULL, "id_user" varchar NOT NULL, "dthr_create" datetime NOT NULL DEFAULT (datetime('now')), "dthr_update" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('active','filed') ) NOT NULL, "id_user" varchar NOT NULL, "dthr_create" datetime NOT NULL DEFAULT (datetime('now')), "dthr_update" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f4f182421a89338bdc432d6adf7" FOREIGN KEY ("id_user") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "status", "id_user", "dthr_create", "dthr_update") SELECT "id", "title", "description", "status", "id_user", "dthr_create", "dthr_update" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('active','filed') ) NOT NULL, "id_user" varchar NOT NULL, "dthr_create" datetime NOT NULL DEFAULT (datetime('now')), "dthr_update" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "status", "id_user", "dthr_create", "dthr_update") SELECT "id", "title", "description", "status", "id_user", "dthr_create", "dthr_update" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
