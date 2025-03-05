/*
  Warnings:

  - You are about to drop the column `userDemographics` on the `AppAnalysisData` table. All the data in the column will be lost.
  - Added the required column `targetDemographic` to the `AppAnalysisData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppAnalysisData" DROP COLUMN "userDemographics",
ADD COLUMN     "targetDemographic" TEXT NOT NULL;
