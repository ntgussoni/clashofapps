-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "categories" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "ratings" INTEGER NOT NULL,
    "reviews" INTEGER NOT NULL,
    "histogram" JSONB NOT NULL,
    "installs" TEXT NOT NULL,
    "version" TEXT,
    "rawData" JSONB NOT NULL,
    "lastFetched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppReview" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userImage" TEXT,
    "date" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "title" TEXT,
    "text" TEXT NOT NULL,
    "thumbsUp" INTEGER,
    "version" TEXT,
    "rawData" JSONB NOT NULL,
    "appId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "analysisDepth" TEXT NOT NULL DEFAULT 'detailed',
    "reviewSample" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisApp" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "isMainApp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppAnalysisData" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "marketPosition" TEXT NOT NULL,
    "userDemographics" TEXT NOT NULL,
    "topFeatures" JSONB NOT NULL,
    "pricing" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "rawAnalysis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppAnalysisData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonData" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "apps" JSONB NOT NULL,
    "featureComparison" JSONB NOT NULL,
    "strengthsComparison" JSONB NOT NULL,
    "weaknessesComparison" JSONB NOT NULL,
    "marketPositionComparison" JSONB NOT NULL,
    "pricingComparison" JSONB NOT NULL,
    "userBaseComparison" JSONB NOT NULL,
    "recommendationSummary" JSONB NOT NULL,
    "rawComparisonData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComparisonData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_appId_key" ON "App"("appId");

-- CreateIndex
CREATE INDEX "AppReview_appId_idx" ON "AppReview"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "AppReview_appId_reviewId_key" ON "AppReview"("appId", "reviewId");

-- CreateIndex
CREATE INDEX "Analysis_userId_idx" ON "Analysis"("userId");

-- CreateIndex
CREATE INDEX "AnalysisApp_analysisId_idx" ON "AnalysisApp"("analysisId");

-- CreateIndex
CREATE INDEX "AnalysisApp_appId_idx" ON "AnalysisApp"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisApp_analysisId_appId_key" ON "AnalysisApp"("analysisId", "appId");

-- CreateIndex
CREATE INDEX "AppAnalysisData_appId_idx" ON "AppAnalysisData"("appId");

-- CreateIndex
CREATE INDEX "AppAnalysisData_analysisId_idx" ON "AppAnalysisData"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "AppAnalysisData_analysisId_appId_key" ON "AppAnalysisData"("analysisId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonData_analysisId_key" ON "ComparisonData"("analysisId");

-- AddForeignKey
ALTER TABLE "AppReview" ADD CONSTRAINT "AppReview_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisApp" ADD CONSTRAINT "AnalysisApp_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisApp" ADD CONSTRAINT "AnalysisApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppAnalysisData" ADD CONSTRAINT "AppAnalysisData_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppAnalysisData" ADD CONSTRAINT "AppAnalysisData_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonData" ADD CONSTRAINT "ComparisonData_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
