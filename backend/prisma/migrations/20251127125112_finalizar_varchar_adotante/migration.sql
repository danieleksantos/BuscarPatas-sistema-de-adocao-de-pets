/*
  Warnings:

  - You are about to alter the column `rua` on the `Adotante` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `numero` on the `Adotante` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `bairro` on the `Adotante` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `cidade` on the `Adotante` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "public"."Adotante" ALTER COLUMN "rua" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "numero" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "bairro" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "cidade" SET DATA TYPE VARCHAR(100);
