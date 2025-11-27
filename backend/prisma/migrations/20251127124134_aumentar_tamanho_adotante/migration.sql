/*
  Warnings:

  - You are about to alter the column `nome` on the `Adotante` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "public"."Adotante" ALTER COLUMN "nome" SET DATA TYPE VARCHAR(100);
