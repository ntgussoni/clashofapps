/*
  Warnings:

  - Added the required column `opportunities` to the `AppAnalysisData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threats` to the `AppAnalysisData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppAnalysisData" ADD COLUMN     "opportunities" JSONB NOT NULL,
ADD COLUMN     "threats" JSONB NOT NULL;
