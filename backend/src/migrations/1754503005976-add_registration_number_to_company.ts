import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegistrationNumberToCompany1754503005976 implements MigrationInterface {
    name = 'AddRegistrationNumberToCompany1754503005976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "registrationNumber" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "registrationNumber"`);
    }

}
