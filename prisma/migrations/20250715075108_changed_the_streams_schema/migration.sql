-- AlterTable
ALTER TABLE "streams" ADD COLUMN     "bigImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
