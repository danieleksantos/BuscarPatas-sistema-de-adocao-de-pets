/*
  Warnings:

  - You are about to alter the column `email` on the `Auth` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `senha` on the `Auth` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "public"."Auth" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "senha" SET DATA TYPE VARCHAR(100);
