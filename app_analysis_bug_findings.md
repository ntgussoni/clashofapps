# App Analysis Bug Investigation - Findings

## Problem Summary

**Input**: 2 Apple App Store URLs:
- `https://apps.apple.com/uy/app/buffer-plan-schedule-posts/id490474324`
- `https://apps.apple.com/uy/app/hootsuite-social-media-tools/id341249709`

**Issues Found**:
1. **12 apps displayed** instead of expected 2
2. **Malformed URL**: Contains `httpspercent3a` encoding issues
3. **Mystery app**: "sprout-social" appearing without being inputted

## Root Cause Analysis

### Issue 1: URL Slug Generation Bug ✅ FIXED

**File**: `src/utils/slug.ts:13-25`

**Problem**: The `generateAnalysisSlug` function was using full URLs instead of extracted app IDs:

```typescript
// BROKEN - Uses full URLs with special characters
const baseSlug = slugify(appStoreIds.join("-"), {
  lower: true,
  replacement: "-", 
  trim: true,
});
```

**Solution Applied**: Modified the function to extract clean app IDs before slug generation:

```typescript
// FIXED - Extracts app IDs first
const appIds = appStoreIds.map(id => {
  if (/^\d+$/.test(id)) return id; // Already clean
  const { appId } = extractAppId(id); // Extract from URL
  return appId;
});
const baseSlug = slugify(appIds.join("-"), {/*...*/});
```

### Issue 2: Data Flow Architecture

**Files Involved**:
- `src/components/hero-section.tsx` - Frontend URL processing
- `src/server/api/routers/analysis.ts` - Backend analysis creation
- `src/utils/slug.ts` - Slug generation

**Problem**: Inconsistent data handling between frontend and backend:
1. Frontend correctly extracts app IDs with `extractAppIds()`
2. Backend receives full URLs as `appStoreIds` parameter
3. Slug generator was expecting app IDs but getting full URLs

### Issue 3: 12 Apps Display (Needs Investigation)

**Likely Causes**:
- Dashboard showing aggregated data from multiple analyses
- Database contains stale/duplicate app records
- Analysis view pulling in recommended/related apps

**Investigation Needed**:
- Check `getUserAnalyses()` query in dashboard
- Verify analysis-to-app relationships in database
- Confirm data isolation between different analyses

### Issue 4: Mystery "sprout-social" App

**Potential Sources**:
- Previous analysis data persisting in database
- Cross-contamination between user analyses
- Recommendation system adding related apps

## Technical Details

### Files Modified:
- ✅ `src/utils/slug.ts` - Fixed slug generation to extract clean app IDs

### Files for Future Investigation:
- `src/components/dashboard/dashboard-content.tsx` - Dashboard display logic
- `src/server/api/routers/analysis.ts` - Analysis creation and retrieval
- Database schema - App and Analysis relationship integrity

## Status

✅ **Immediate Fix Applied**: URL malformation issue resolved
🔍 **Requires Testing**: 12 apps display and mystery app issues
📋 **Next Steps**: Database investigation and fresh analysis testing

## Expected Outcome

With the slug generation fix:
- URLs should now be clean: `/analysis/490474324-341249709-abc123`
- No more `httpspercent3a` encoding issues
- Readable and shareable analysis URLs

The remaining issues require database inspection and testing with fresh user data to determine if they're caused by stale data or systematic problems.