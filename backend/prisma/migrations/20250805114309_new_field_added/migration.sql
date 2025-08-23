/*
  Warnings:

  - Added the required column `leftFileId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainFileId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightFileId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topFileId` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."product" ADD COLUMN     "leftFileId" TEXT NOT NULL,
ADD COLUMN     "mainFileId" TEXT NOT NULL,
ADD COLUMN     "rightFileId" TEXT NOT NULL,
ADD COLUMN     "topFileId" TEXT NOT NULL;
