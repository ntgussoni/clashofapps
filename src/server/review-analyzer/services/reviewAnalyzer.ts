import { streamText, createDataStream } from "ai";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { AppInfo, AppAnalysis, Review } from "../types";
import { appAnalysisSchema } from "../schemas";

// Configure OpenAI
const model = openai("gpt-4o-mini");

/**
 * Analyzes a batch of reviews from a single app
 * @param appInfo - Object containing app information and reviews
 * @param sampleSize - Number of reviews to analyze (default: 50)
 * @param analysisDepth - Depth of analysis to perform (default: "detailed")
 * @returns Promise resolving to AppAnalysis result
 */
export async function analyzeReviews(
  appInfo: AppInfo,
  sampleSize: number = 50,
  analysisDepth: string = "detailed"
): Promise<AppAnalysis> {
  // Take a representative sample of reviews
  const reviewSample = appInfo.reviews.slice(
    0,
    Math.min(sampleSize, appInfo.reviews.length)
  );

  console.log(
    `Analyzing ${reviewSample.length} reviews for ${appInfo.appName}...`
  );

  // Categorize reviews by rating for more balanced analysis
  const reviewsByRating: Record<number, Review[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  reviewSample.forEach((review) => {
    const score = review.score || 3;
    if (reviewsByRating[score]) {
      reviewsByRating[score].push(review);
    }
  });

  // Ensure we have a balanced sample that includes more critical reviews
  const balancedSample: Review[] = [];
  // Always include more low ratings for thorough analysis
  const targetDistribution = {
    1: Math.min(10, reviewsByRating[1].length),
    2: Math.min(10, reviewsByRating[2].length),
    3: Math.min(10, reviewsByRating[3].length),
    4: Math.min(15, reviewsByRating[4].length),
    5: Math.min(15, reviewsByRating[5].length),
  };

  Object.entries(targetDistribution).forEach(([rating, count]) => {
    balancedSample.push(...reviewsByRating[Number(rating)].slice(0, count));
  });

  // If we haven't reached our sample size, add more reviews
  if (balancedSample.length < sampleSize) {
    const remaining = reviewSample.filter(
      (review) => !balancedSample.some((r) => r.id === review.id)
    );
    balancedSample.push(
      ...remaining.slice(0, sampleSize - balancedSample.length)
    );
  }

  // Create a prompt for review analysis
  const prompt = `
    You are an expert app market analyst specializing in competitive analysis. You need to analyze a set of user reviews for the app "${
      appInfo.appName
    }".
    
    ## App Context
    - App Name: ${appInfo.appName}
    - Categories: ${appInfo.categories.join(", ")}
    - Current Version: ${appInfo.version}
    - Last Updated: ${appInfo.updated.toISOString().split("T")[0]}
    - Installs: ${appInfo.installs}
    - Overall Rating: ${appInfo.appScore.toFixed(1)}/5
    
    ## App Description
    ${appInfo.appDescription.slice(0, 500)}...
    
    ## Analysis Goal
    I need you to identify this app's key strengths and weaknesses based on user reviews.
    Focus on what users love and hate about this app, paying special attention to specific features,
    user segments, and areas where this app might be vulnerable to competition.
    Be brutally honest in your assessment - I'm looking to build a competitive app, so I need
    to understand where I can outperform this existing solution.
    
    ## Reviews to Analyze
    I'm providing a balanced sample of ${
      balancedSample.length
    } reviews across different ratings:
    - ${reviewsByRating[1].length} one-star reviews
    - ${reviewsByRating[2].length} two-star reviews
    - ${reviewsByRating[3].length} three-star reviews
    - ${reviewsByRating[4].length} four-star reviews
    - ${reviewsByRating[5].length} five-star reviews
    
    ${balancedSample
      .map(
        (review, i) => `
    REVIEW #${i + 1} [${review.score}/5 stars] (${
          new Date(review.date).toISOString().split("T")[0]
        }):
    "${review.title ? `${review.title}: ` : ""}${review.text}"
    `
      )
      .join("\n")}
    
    Based on these reviews, provide a comprehensive analysis of the app with a focus on competitive positioning.
    Depth of analysis: ${analysisDepth} (more ${
    analysisDepth === "comprehensive"
      ? "detailed"
      : analysisDepth === "basic"
      ? "concise"
      : "balanced"
  })
  `;

  // Generate the analysis
  const { object: analysis } = await generateObject({
    model,
    schema: appAnalysisSchema,
    maxRetries: 3,
    prompt,
    temperature: 0.2, // Lower temperature for more consistent analysis
  });

  return analysis as AppAnalysis;
}

/**
 * Streaming version of the review analyzer that sends updates during the analysis process
 * @param appInfo - Object containing app information and reviews
 * @param sampleSize - Number of reviews to analyze (default: 50)
 * @param analysisDepth - Depth of analysis to perform (default: "detailed")
 * @returns A data stream with the analysis progress and results
 */
export function streamingAnalyzeReviews(
  appInfo: AppInfo,
  sampleSize: number = 50,
  analysisDepth: string = "detailed"
) {
  // Create a data stream that will send updates to the client
  const dataStream = createDataStream();

  // This function will perform the analysis and send updates
  const analyze = async () => {
    try {
      // Take a representative sample of reviews
      const reviewSample = appInfo.reviews.slice(
        0,
        Math.min(sampleSize, appInfo.reviews.length)
      );

      // Send initialization update
      dataStream.emit({
        type: "status",
        status: "initializing",
        message: `Starting analysis of ${appInfo.appName}...`,
        progress: 0,
        appInfo: {
          appId: appInfo.appId,
          appName: appInfo.appName,
          appScore: appInfo.appScore,
          reviewCount: reviewSample.length,
        },
      });

      // Categorize reviews by rating
      const reviewsByRating: Record<number, Review[]> = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      reviewSample.forEach((review) => {
        const score = review.score || 3;
        if (reviewsByRating[score]) {
          reviewsByRating[score].push(review);
        }
      });

      // Send review distribution update
      dataStream.emit({
        type: "status",
        status: "processing",
        message: "Categorizing reviews by rating...",
        progress: 10,
        reviewDistribution: {
          oneStar: reviewsByRating[1].length,
          twoStar: reviewsByRating[2].length,
          threeStar: reviewsByRating[3].length,
          fourStar: reviewsByRating[4].length,
          fiveStar: reviewsByRating[5].length,
        },
      });

      // Create balanced sample
      const balancedSample: Review[] = [];
      const targetDistribution = {
        1: Math.min(10, reviewsByRating[1].length),
        2: Math.min(10, reviewsByRating[2].length),
        3: Math.min(10, reviewsByRating[3].length),
        4: Math.min(15, reviewsByRating[4].length),
        5: Math.min(15, reviewsByRating[5].length),
      };

      Object.entries(targetDistribution).forEach(([rating, count]) => {
        balancedSample.push(...reviewsByRating[Number(rating)].slice(0, count));
      });

      // If we haven't reached our sample size, add more reviews
      if (balancedSample.length < sampleSize) {
        const remaining = reviewSample.filter(
          (review) => !balancedSample.some((r) => r.id === review.id)
        );
        balancedSample.push(
          ...remaining.slice(0, sampleSize - balancedSample.length)
        );
      }

      // Send sample creation update
      dataStream.emit({
        type: "status",
        status: "processing",
        message: "Created balanced review sample...",
        progress: 20,
        sampleSize: balancedSample.length,
      });

      // Create a prompt for review analysis
      const prompt = `
        You are an expert app market analyst specializing in competitive analysis. You need to analyze a set of user reviews for the app "${
          appInfo.appName
        }".
        
        ## App Context
        - App Name: ${appInfo.appName}
        - Categories: ${appInfo.categories.join(", ")}
        - Current Version: ${appInfo.version}
        - Last Updated: ${appInfo.updated.toISOString().split("T")[0]}
        - Installs: ${appInfo.installs}
        - Overall Rating: ${appInfo.appScore.toFixed(1)}/5
        
        ## App Description
        ${appInfo.appDescription.slice(0, 500)}...
        
        ## Analysis Goal
        I need you to identify this app's key strengths and weaknesses based on user reviews.
        Focus on what users love and hate about this app, paying special attention to specific features,
        user segments, and areas where this app might be vulnerable to competition.
        Be brutally honest in your assessment - I'm looking to build a competitive app, so I need
        to understand where I can outperform this existing solution.
        
        ## Reviews to Analyze
        I'm providing a balanced sample of ${
          balancedSample.length
        } reviews across different ratings:
        - ${reviewsByRating[1].length} one-star reviews
        - ${reviewsByRating[2].length} two-star reviews
        - ${reviewsByRating[3].length} three-star reviews
        - ${reviewsByRating[4].length} four-star reviews
        - ${reviewsByRating[5].length} five-star reviews
        
        ${balancedSample
          .map(
            (review, i) => `
        REVIEW #${i + 1} [${review.score}/5 stars] (${
              new Date(review.date).toISOString().split("T")[0]
            }):
        "${review.title ? `${review.title}: ` : ""}${review.text}"
        `
          )
          .join("\n")}
        
        Based on these reviews, provide a comprehensive analysis of the app with a focus on competitive positioning.
        Depth of analysis: ${analysisDepth} (more ${
        analysisDepth === "comprehensive"
          ? "detailed"
          : analysisDepth === "basic"
          ? "concise"
          : "balanced"
      })
        
        First provide a step-by-step analysis in these stages:
        1. Initial observations and notable patterns
        2. Key strengths identified
        3. Main weaknesses and pain points
        4. User segment analysis
        5. Feature analysis
        6. Competitive positioning
        7. Final recommendations
        
        After each step, wait for me to ask for the next step.
      `;

      // Send analysis starting update
      dataStream.emit({
        type: "status",
        status: "analyzing",
        message: "Starting AI analysis of reviews...",
        progress: 30,
      });

      // Stream the initial analysis process to show progress
      const textStream = await streamText({
        model,
        maxSteps: 7,
        messages: [{ role: "user", content: prompt }],
      });

      // Process and forward the stream with progress updates
      let step = 0;
      const steps = [
        "observations",
        "strengths",
        "weaknesses",
        "segments",
        "features",
        "positioning",
        "recommendations",
      ];
      const stepProgress = [40, 50, 60, 70, 80, 90, 95];

      for await (const chunk of textStream) {
        // Check if this chunk indicates a new step
        if (
          chunk.content.includes(`Step ${step + 1}:`) ||
          chunk.content.includes(`${step + 1}.`) ||
          chunk.content.includes(steps[step])
        ) {
          step = Math.min(step + 1, steps.length - 1);

          dataStream.emit({
            type: "status",
            status: "analyzing",
            message: `Analyzing ${steps[step]}...`,
            progress: stepProgress[step],
            currentStep: step + 1,
            totalSteps: steps.length,
          });
        }

        // Send the chunk
        dataStream.emit({
          type: "analysisChunk",
          chunk: chunk.content,
        });
      }

      // Now generate the structured analysis object
      dataStream.emit({
        type: "status",
        status: "finalizing",
        message: "Generating structured analysis...",
        progress: 98,
      });

      // Generate the final structured analysis
      const { object: analysis } = await generateObject({
        model,
        schema: appAnalysisSchema,
        maxRetries: 3,
        prompt,
        temperature: 0.2,
      });

      // Send the complete analysis
      dataStream.emit({
        type: "result",
        status: "completed",
        message: "Analysis complete",
        progress: 100,
        analysis: analysis as AppAnalysis,
      });

      // Close the stream when done
      dataStream.close();
    } catch (error) {
      console.error("Error in streaming analysis:", error);

      // Send error status
      dataStream.emit({
        type: "error",
        status: "error",
        message: `Analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });

      // Close the stream on error
      dataStream.close();
    }
  };

  // Start the analysis process without awaiting it
  analyze();

  // Return the data stream
  return dataStream;
}
