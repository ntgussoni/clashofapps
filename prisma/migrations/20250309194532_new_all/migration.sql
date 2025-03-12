/*
  Warnings:

  - You are about to drop the column `comparisonDataId` on the `App` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_comparisonDataId_fkey";

-- AlterTable
ALTER TABLE "App" DROP COLUMN "comparisonDataId",
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "ratings" DROP NOT NULL,
ALTER COLUMN "reviews" DROP NOT NULL,
ALTER COLUMN "histogram" DROP NOT NULL,
ALTER COLUMN "installs" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_AppToComparisonData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppToComparisonData_AB_unique" ON "_AppToComparisonData"("A", "B");

-- CreateIndex
CREATE INDEX "_AppToComparisonData_B_index" ON "_AppToComparisonData"("B");

-- AddForeignKey
ALTER TABLE "_AppToComparisonData" ADD CONSTRAINT "_AppToComparisonData_A_fkey" FOREIGN KEY ("A") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppToComparisonData" ADD CONSTRAINT "_AppToComparisonData_B_fkey" FOREIGN KEY ("B") REFERENCES "ComparisonData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
