/*
  Warnings:

  - You are about to drop the column `location` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Application` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residentialAddress` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "location",
DROP COLUMN "origin",
DROP COLUMN "userName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "phoneCountryCode" TEXT,
ADD COLUMN     "residentialAddress" JSONB NOT NULL;
