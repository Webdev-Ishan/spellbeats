/*
  Warnings:

  - You are about to drop the column `type` on the `streams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "streams" DROP COLUMN "type";

-- DropEnum
DROP TYPE "streamtype";
