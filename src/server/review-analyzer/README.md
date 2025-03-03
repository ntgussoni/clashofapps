# Google Play Review Analyzer

A powerful tool for analyzing Google Play Store app reviews and conducting competitive analysis.

## Features

- Fetches app data and reviews from Google Play Store
- Performs sentiment analysis on reviews
- Identifies key features and user segments
- Compares competitive positioning across multiple apps
- Generates detailed reports in JSON and Markdown formats
- Provides actionable recommendations based on analysis

## Directory Structure

```
src/libs/review-analyzer/
├── index.ts              # Main entry point and analysis orchestration
├── cli.ts                # Command-line interface
├── types.ts              # TypeScript interfaces and type definitions
├── schemas.ts            # Zod validation schemas
├── services/
│   ├── dataFetcher.ts    # Functions for fetching app data
│   ├── reviewAnalyzer.ts # Core review analysis logic
│   └── competitorAnalyzer.ts # Competitor analysis logic
└── utils/
    └── reportGenerator.ts # Report generation utilities
```

## Usage

### As a command-line tool

```bash
# Basic usage
bun run src/libs/review-analyzer/cli.ts <yourAppId> <competitor1> <competitor2>

# Example with options
bun run src/libs/review-analyzer/cli.ts com.spotify.music com.pandora.android com.apple.android.music --count=200 --depth=comprehensive
```

### As a library

```typescript
import { analyzeCompetitors } from "./src/libs/review-analyzer";

async function runAnalysis() {
  const result = await analyzeCompetitors({
    yourAppId: "com.yourapp.id",
    competitors: ["com.competitor1.id", "com.competitor2.id"],
    reviewCount: 150,
    analysisDepth: "detailed",
    outputDir: "./my-analysis",
  });

  console.log("Analysis complete!");
}

runAnalysis();
```

## Options

| Option              | Description                                              | Default      |
| ------------------- | -------------------------------------------------------- | ------------ |
| `yourAppId`         | Your Google Play Store app ID                            | (required)   |
| `competitors`       | Array of competitor app IDs                              | (required)   |
| `reviewCount`       | Number of reviews to fetch per app                       | 100          |
| `outputDir`         | Directory for analysis output                            | "./analysis" |
| `analysisDepth`     | Level of detail: "basic", "detailed", or "comprehensive" | "detailed"   |
| `includePricing`    | Whether to include pricing analysis                      | true         |
| `targetUserSegment` | Focus on a specific user segment                         | ""           |

## Dependencies

- google-play-scraper: For fetching app data
- OpenAI (ai-sdk): For analyzing reviews
- Zod: For schema validation

## Note on Analysis Accuracy

The review analyzer uses a combination of:

- Real data from Google Play Store
- AI-powered analysis using GPT-4o

While the analysis is based on real user reviews, the interpretation and competitive insights involve AI-generated content, which should be verified against your own market knowledge.
