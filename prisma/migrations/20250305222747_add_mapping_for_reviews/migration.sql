-- AlterTable
ALTER TABLE "AppAnalysisData" ADD COLUMN     "featuresReviewMap" JSONB,
ADD COLUMN     "sentimentReviewMap" JSONB,
ADD COLUMN     "strengthsReviewMap" JSONB,
ADD COLUMN     "weaknessesReviewMap" JSONB;
