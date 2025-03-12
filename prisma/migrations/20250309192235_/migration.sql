/*
  Warnings:

  - You are about to drop the column `description` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `isMainApp` on the `AnalysisApp` table. All the data in the column will be lost.
  - You are about to drop the column `analysisId` on the `AppAnalysisData` table. All the data in the column will be lost.
  - You are about to drop the column `appId` on the `AppAnalysisData` table. All the data in the column will be lost.
  - You are about to drop the column `apps` on the `ComparisonData` table. All the data in the column will be lost.
  - You are about to drop the column `rawComparisonData` on the `ComparisonData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appAnalysisDataId]` on the table `App` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appStoreId` to the `AnalysisApp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppAnalysisData" DROP CONSTRAINT "AppAnalysisData_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "AppAnalysisData" DROP CONSTRAINT "AppAnalysisData_appId_fkey";

-- DropIndex
DROP INDEX "AppAnalysisData_analysisId_appId_key";

-- DropIndex
DROP INDEX "AppAnalysisData_analysisId_idx";

-- DropIndex
DROP INDEX "AppAnalysisData_appId_idx";

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "description",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "AnalysisApp" DROP COLUMN "isMainApp",
ADD COLUMN     "appStoreId" TEXT NOT NULL,
ALTER COLUMN "appId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "appAnalysisDataId" INTEGER,
ADD COLUMN     "comparisonDataId" INTEGER;

-- AlterTable
ALTER TABLE "AppAnalysisData" DROP COLUMN "analysisId",
DROP COLUMN "appId";

-- AlterTable
ALTER TABLE "ComparisonData" DROP COLUMN "apps",
DROP COLUMN "rawComparisonData";

-- CreateIndex
CREATE UNIQUE INDEX "App_appAnalysisDataId_key" ON "App"("appAnalysisDataId");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_appAnalysisDataId_fkey" FOREIGN KEY ("appAnalysisDataId") REFERENCES "AppAnalysisData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_comparisonDataId_fkey" FOREIGN KEY ("comparisonDataId") REFERENCES "ComparisonData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
