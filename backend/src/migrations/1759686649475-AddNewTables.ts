import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTables1759686649475 implements MigrationInterface {
    name = 'AddNewTables1759686649475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."car_model_category_enum" AS ENUM('sedan', 'suv', 'truck', 'van', 'convertible', 'coupe', 'hatchback')`);
        await queryRunner.query(`CREATE TYPE "public"."car_model_transmission_enum" AS ENUM('manual', 'automatic')`);
        await queryRunner.query(`CREATE TYPE "public"."car_model_fueltype_enum" AS ENUM('gasoline', 'diesel', 'electric', 'hybrid')`);
        await queryRunner.query(`CREATE TABLE "car_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying(100) NOT NULL, "model" character varying(100) NOT NULL, "year" integer NOT NULL, "category" "public"."car_model_category_enum" NOT NULL, "seats" integer NOT NULL, "transmission" "public"."car_model_transmission_enum" NOT NULL, "fuelType" "public"."car_model_fueltype_enum" NOT NULL, "dailyRate" numeric(10,2) NOT NULL, "description" text, "features" text, "imageUrl" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_525071eea12c671d67e35a5cbc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cars_status_enum" AS ENUM('available', 'rented', 'maintenance', 'out_of_service')`);
        await queryRunner.query(`CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "licensePlate" character varying(50) NOT NULL, "vin" character varying(17) NOT NULL, "color" character varying(50) NOT NULL, "mileage" integer NOT NULL DEFAULT '0', "status" "public"."cars_status_enum" NOT NULL DEFAULT 'available', "location" character varying(100), "lastServiceDate" date, "nextServiceDate" date, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "carModelId" uuid, CONSTRAINT "UQ_1df40c87717e8631a39fd42920a" UNIQUE ("licensePlate"), CONSTRAINT "UQ_1a56deecb54b4ed4917445f49e9" UNIQUE ("vin"), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'unassigned'`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_a7c6baf734471a7f87ff4facafa" FOREIGN KEY ("carModelId") REFERENCES "car_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_a7c6baf734471a7f87ff4facafa"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'customer'`);
        await queryRunner.query(`DROP TABLE "cars"`);
        await queryRunner.query(`DROP TYPE "public"."cars_status_enum"`);
        await queryRunner.query(`DROP TABLE "car_model"`);
        await queryRunner.query(`DROP TYPE "public"."car_model_fueltype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_model_transmission_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_model_category_enum"`);
    }

}
