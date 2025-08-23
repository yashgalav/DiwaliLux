/*
  Warnings:

  - You are about to drop the column `right` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `rightFileId` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "right",
DROP COLUMN "rightFileId";
