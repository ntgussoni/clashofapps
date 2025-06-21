-- Add platform field to App table
ALTER TABLE "App" ADD COLUMN "platform" TEXT NOT NULL DEFAULT 'google_play';

-- Add comment for the column
COMMENT ON COLUMN "App"."platform" IS 'Platform: google_play or app_store';

-- Update existing records to have the correct platform based on appStoreId format
UPDATE "App" 
SET "platform" = CASE 
    WHEN "appStoreId" ~ '^\d+$' THEN 'app_store'
    WHEN "appStoreId" LIKE '%.%' THEN 'google_play'
    ELSE 'google_play'
END;