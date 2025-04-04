/*
  Warnings:

  - You are about to drop the column `strengthsComparison` on the `ComparisonData` table. All the data in the column will be lost.
  - You are about to drop the column `weaknessesComparison` on the `ComparisonData` table. All the data in the column will be lost.
  - Added the required column `reviews` to the `ComparisonData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComparisonData" DROP COLUMN "strengthsComparison",
DROP COLUMN "weaknessesComparison",
ADD COLUMN     "reviews" JSONB NOT NULL;
