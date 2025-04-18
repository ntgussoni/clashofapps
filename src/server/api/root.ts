import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { reviewsRouter } from "./routers/reviews";
import { analysisRouter } from "./routers/analysis";
import { creditsRouter } from "./routers/credits";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reviews: reviewsRouter,
  analysis: analysisRouter,
  credits: creditsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
