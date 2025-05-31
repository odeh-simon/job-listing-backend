/*
  Warnings:

  - You are about to drop the column `academicQual` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "academicQual",
DROP COLUMN "socialLinks";
