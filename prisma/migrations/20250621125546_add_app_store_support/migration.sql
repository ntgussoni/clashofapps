/*
  Warnings:

  - A unique constraint covering the columns `[appStoreId,platform]` on the table `App` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `platform` to the `AnalysisApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('GOOGLE_PLAY', 'APP_STORE');

-- DropIndex
DROP INDEX "App_appStoreId_key";

-- AlterTable
ALTER TABLE "AnalysisApp" ADD COLUMN     "platform" "Platform" NOT NULL;

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "platform" "Platform" NOT NULL;

-- CreateIndex
CREATE INDEX "AnalysisApp_platform_idx" ON "AnalysisApp"("platform");

-- CreateIndex
CREATE INDEX "App_platform_idx" ON "App"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "App_appStoreId_platform_key" ON "App"("appStoreId", "platform");
