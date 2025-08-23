/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "loginMethod" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_key" ON "public"."user"("googleId");
