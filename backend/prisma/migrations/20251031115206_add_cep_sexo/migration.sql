-- CreateEnum
CREATE TYPE "public"."Sexo" AS ENUM ('MACHO', 'FEMEA');

-- AlterTable
ALTER TABLE "public"."Adotante" ADD COLUMN     "cep" VARCHAR(8);

-- AlterTable
ALTER TABLE "public"."Pet" ADD COLUMN     "sexo" "public"."Sexo" NOT NULL DEFAULT 'FEMEA';
