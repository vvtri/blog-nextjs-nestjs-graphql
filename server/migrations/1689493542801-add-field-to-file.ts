import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToFile1689493542801 implements MigrationInterface {
    name = 'AddFieldToFile1689493542801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "file" ADD "mimetype" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "public_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "public_id"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "mimetype"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
