/*
  Warnings:

  - The `appId` column on the `AnalysisApp` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `appId` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `topFeatures` on the `AppAnalysisData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appStoreId]` on the table `App` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appStoreId` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyFeatures` to the `AppAnalysisData` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `appId` on the `AppReview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AnalysisApp" DROP CONSTRAINT "AnalysisApp_appId_fkey";

-- DropForeignKey
ALTER TABLE "AppReview" DROP CONSTRAINT "AppReview_appId_fkey";

-- DropIndex
DROP INDEX "App_appId_key";

-- AlterTable
ALTER TABLE "AnalysisApp" DROP COLUMN "appId",
ADD COLUMN     "appId" INTEGER;

-- AlterTable
ALTER TABLE "App" DROP COLUMN "appId",
ADD COLUMN     "appStoreId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AppAnalysisData" DROP COLUMN "topFeatures",
ADD COLUMN     "keyFeatures" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "AppReview" DROP COLUMN "appId",
ADD COLUMN     "appId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "AnalysisApp_appId_idx" ON "AnalysisApp"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisApp_analysisId_appId_key" ON "AnalysisApp"("analysisId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "App_appStoreId_key" ON "App"("appStoreId");

-- CreateIndex
CREATE INDEX "AppReview_appId_idx" ON "AppReview"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "AppReview_appId_reviewId_key" ON "AppReview"("appId", "reviewId");

-- AddForeignKey
ALTER TABLE "AppReview" ADD CONSTRAINT "AppReview_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisApp" ADD CONSTRAINT "AnalysisApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
