-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "creator" TEXT NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
