import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewProps1759829030177 implements MigrationInterface {
    name = 'AddNewProps1759829030177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ADD "companyId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_model" ADD "companyId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_model" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "company" ADD "logoUrl" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "company" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "UQ_b0fc567cf51b1cf717a9e8046a1" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_model" ADD CONSTRAINT "FK_89a4e37931b4ca87aabda3ba523" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_model" ADD CONSTRAINT "FK_c59e0c10beb77f1db6d4e924ed2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_model" DROP CONSTRAINT "FK_c59e0c10beb77f1db6d4e924ed2"`);
        await queryRunner.query(`ALTER TABLE "car_model" DROP CONSTRAINT "FK_89a4e37931b4ca87aabda3ba523"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_b0fc567cf51b1cf717a9e8046a1"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "logoUrl"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "car_model" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "car_model" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "companyId"`);
    }

}
