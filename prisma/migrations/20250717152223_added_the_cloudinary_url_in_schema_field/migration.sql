/*
  Warnings:

  - Added the required column `cloudinaryURL` to the `streams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "streams" ADD COLUMN     "cloudinaryURL" TEXT NOT NULL;
