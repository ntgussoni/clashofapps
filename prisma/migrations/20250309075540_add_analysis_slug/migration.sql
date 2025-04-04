/*
  Warnings:

  - The primary key for the `Analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Analysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AnalysisApp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AnalysisApp` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `App` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `App` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AppAnalysisData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AppAnalysisData` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AppReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AppReview` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ComparisonData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ComparisonData` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `analysisId` on the `AnalysisApp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `analysisId` on the `AppAnalysisData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `analysisId` on the `ComparisonData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AnalysisApp" DROP CONSTRAINT "AnalysisApp_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "AppAnalysisData" DROP CONSTRAINT "AppAnalysisData_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "ComparisonData" DROP CONSTRAINT "ComparisonData_analysisId_fkey";

-- AlterTable
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_pkey",
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AnalysisApp" DROP CONSTRAINT "AnalysisApp_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "analysisId",
ADD COLUMN     "analysisId" INTEGER NOT NULL,
ADD CONSTRAINT "AnalysisApp_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "App" DROP CONSTRAINT "App_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "App_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AppAnalysisData" DROP CONSTRAINT "AppAnalysisData_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "analysisId",
ADD COLUMN     "analysisId" INTEGER NOT NULL,
ADD CONSTRAINT "AppAnalysisData_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AppReview" DROP CONSTRAINT "AppReview_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AppReview_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ComparisonData" DROP CONSTRAINT "ComparisonData_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "analysisId",
ADD COLUMN     "analysisId" INTEGER NOT NULL,
ADD CONSTRAINT "ComparisonData_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_slug_key" ON "Analysis"("slug");

-- CreateIndex
CREATE INDEX "AnalysisApp_analysisId_idx" ON "AnalysisApp"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisApp_analysisId_appId_key" ON "AnalysisApp"("analysisId", "appId");

-- CreateIndex
CREATE INDEX "AppAnalysisData_analysisId_idx" ON "AppAnalysisData"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "AppAnalysisData_analysisId_appId_key" ON "AppAnalysisData"("analysisId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonData_analysisId_key" ON "ComparisonData"("analysisId");

-- AddForeignKey
ALTER TABLE "AnalysisApp" ADD CONSTRAINT "AnalysisApp_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppAnalysisData" ADD CONSTRAINT "AppAnalysisData_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonData" ADD CONSTRAINT "ComparisonData_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
