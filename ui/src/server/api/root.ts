//import { postRouter } from "~/server/api/routers/post";
import { gameRouter } from "~/server/api/routers/game";
import { pileRouter } from "~/server/api/routers/pile";
import { pieceRouter } from "~/server/api/routers/piece";

import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: gameRouter,
  pile: pileRouter,
  piece: pieceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
